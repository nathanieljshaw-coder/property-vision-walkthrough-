import { neon } from "@neondatabase/serverless";
import crypto from "crypto";

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export type User = {
  id: number;
  email: string;
  name: string;
  password_hash: string;
  phone: string | null;
  created_at: string;
};

export type Session = { token: string; user_id: number; expires_at: string };
export type PasswordResetToken = { token: string; user_id: number; expires_at: string; used: boolean };
export type Order = {
  id: number; user_id: number; stripe_session_id: string | null; slug: string; product_name: string;
  amount: number; phone: string | null; whatsapp_opt_in: boolean; auto_email: boolean; status: string;
  approval_status: "pending" | "agreed" | "declined" | null; walkthrough_status: string;
  walkthrough_url: string | null; notes: string | null; created_at: string; updated_at: string;
};

export type ImageRequest = {
  id: number; order_id: number; message: string; status: string; created_at: string;
};

export type UploadedImage = {
  id: number; request_id: number; user_id: number; filename: string; url: string; size: number; created_at: string;
};

const ADMIN_EMAIL = "nathaniel.j.shaw@outlook.com";
const memory = { users: [] as User[], sessions: [] as Session[], orders: [] as Order[], resets: [] as PasswordResetToken[] };
let initialized = false;

async function db<T>(query: Promise<T>, fallback: T): Promise<T> {
  if (!sql) return fallback;
  try { return await query; } catch (error) { console.error("Database error", error); return fallback; }
}

export async function initializeDatabase() {
  if (initialized || !sql) return;
  await db(sql`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password_hash TEXT NOT NULL, phone TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`, null);
  await db(sql`CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL)`, null);
  await db(sql`CREATE TABLE IF NOT EXISTS password_reset_tokens (token TEXT PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires_at TIMESTAMPTZ NOT NULL, used BOOLEAN NOT NULL DEFAULT FALSE)`, null);
  await db(sql`CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, stripe_session_id TEXT, slug TEXT NOT NULL, product_name TEXT NOT NULL, amount INTEGER NOT NULL, phone TEXT, whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE, auto_email BOOLEAN NOT NULL DEFAULT TRUE, status TEXT NOT NULL DEFAULT 'paid', approval_status TEXT, walkthrough_status TEXT NOT NULL DEFAULT 'not_started', walkthrough_url TEXT, notes TEXT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`, null);
  await db(sql`CREATE TABLE IF NOT EXISTS image_requests (id SERIAL PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`, null);
  await db(sql`CREATE TABLE IF NOT EXISTS uploaded_images (id SERIAL PRIMARY KEY, request_id INTEGER NOT NULL REFERENCES image_requests(id) ON DELETE CASCADE, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, filename TEXT NOT NULL, url TEXT NOT NULL, size INTEGER NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`, null);
  initialized = true;
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  await initializeDatabase();
  const rows = await db(sql ? sql`SELECT * FROM users WHERE LOWER(email)=LOWER(${email}) LIMIT 1` : Promise.resolve([]), memory.users.filter(u => u.email.toLowerCase() === email.toLowerCase()));
  return (rows as User[])[0];
}
export async function findUserById(id: number): Promise<User | undefined> {
  await initializeDatabase();
  const rows = await db(sql ? sql`SELECT * FROM users WHERE id=${id} LIMIT 1` : Promise.resolve([]), memory.users.filter(u => u.id === id));
  return (rows as User[])[0];
}
export async function createUser(email: string, name: string, passwordHash: string): Promise<User> {
  await initializeDatabase();
  const rows = await db(sql ? sql`INSERT INTO users (email,name,password_hash) VALUES (${email},${name},${passwordHash}) RETURNING *` : Promise.resolve([]), []);
  if ((rows as User[])[0]) return (rows as User[])[0];
  const user = { id: memory.users.length + 1, email, name, password_hash: passwordHash, phone: null, created_at: new Date().toISOString() };
  memory.users.push(user); return user;
}
export async function updateUserEmail(oldEmail: string, newEmail: string) { await initializeDatabase(); if (sql) await db(sql`UPDATE users SET email=${newEmail} WHERE LOWER(email)=LOWER(${oldEmail})`, null); }

export async function createSession(userId: number, maxAgeDays = 30): Promise<string> {
  await initializeDatabase(); const token = crypto.randomUUID(); const expires = new Date(Date.now()+maxAgeDays*86400000).toISOString();
  if (sql) await db(sql`INSERT INTO sessions(token,user_id,expires_at) VALUES(${token},${userId},${expires})`, null); else memory.sessions.push({token,user_id:userId,expires_at:expires}); return token;
}
export async function findSession(token: string): Promise<{token:string;user_id:number;expires_at:string;user:User}|undefined> {
  await initializeDatabase(); const rows = sql ? await db(sql`SELECT s.*, u.email,u.name,u.password_hash,u.phone,u.created_at as user_created_at FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=${token} AND s.expires_at>NOW() LIMIT 1`, []) : memory.sessions.filter(s=>s.token===token).map(s=>({...s,user:memory.users.find(u=>u.id===s.user_id)}));
  const r: any = (rows as any[])[0]; if (!r || !r.user && !r.email) return undefined;
  return sql ? {token:r.token,user_id:r.user_id,expires_at:r.expires_at,user:{id:r.user_id,email:r.email,name:r.name,password_hash:r.password_hash,phone:r.phone,created_at:r.user_created_at}} : r;
}
export async function deleteSession(token:string) { await initializeDatabase(); if(sql) await db(sql`DELETE FROM sessions WHERE token=${token}`,null); else memory.sessions=memory.sessions.filter(s=>s.token!==token); }

export async function createPasswordResetToken(userId:number): Promise<string> { await initializeDatabase(); const token=crypto.randomBytes(32).toString("hex"); const expires=new Date(Date.now()+3600000).toISOString(); if(sql) await db(sql`INSERT INTO password_reset_tokens(token,user_id,expires_at) VALUES(${token},${userId},${expires})`,null); else memory.resets.push({token,user_id:userId,expires_at:expires,used:false}); return token; }
export async function findPasswordResetToken(token:string): Promise<PasswordResetToken|undefined> { await initializeDatabase(); const rows=sql?await db(sql`SELECT * FROM password_reset_tokens WHERE token=${token} AND used=FALSE AND expires_at>NOW() LIMIT 1`,[]):memory.resets.filter(r=>r.token===token&&!r.used&&new Date(r.expires_at)>new Date()); return (rows as PasswordResetToken[])[0]; }
export async function consumePasswordResetToken(token:string): Promise<boolean> { await initializeDatabase(); if(sql){const rows=await db(sql`UPDATE password_reset_tokens SET used=TRUE WHERE token=${token} AND used=FALSE AND expires_at>NOW() RETURNING token`,[]);return rows.length>0;} const r=memory.resets.find(r=>r.token===token&&!r.used);if(r){r.used=true;return true;}return false; }
export async function updateUserPassword(userId:number,passwordHash:string){ await initializeDatabase(); if(sql) await db(sql`UPDATE users SET password_hash=${passwordHash} WHERE id=${userId}`,null); memory.users=memory.users.map(u=>u.id===userId?{...u,password_hash:passwordHash}:u); }
export async function updateUserName(userId:number,name:string){ await initializeDatabase(); if(sql) await db(sql`UPDATE users SET name=${name} WHERE id=${userId}`,null); memory.users=memory.users.map(u=>u.id===userId?{...u,name}:u); }

export function isAdmin(email:string){return email.toLowerCase()===ADMIN_EMAIL.toLowerCase();}

export async function createOrder(userId:number,slug:string,productName:string,amount:number,stripeSessionId?:string,phone?:string|null,whatsappOptIn?:boolean,status="paid",approvalStatus:"pending"|"agreed"|"declined"|null=null):Promise<Order>{ await initializeDatabase(); const rows=sql?await db(sql`INSERT INTO orders(user_id,slug,product_name,amount,stripe_session_id,phone,whatsapp_opt_in,status,approval_status) VALUES(${userId},${slug},${productName},${amount},${stripeSessionId??null},${phone??null},${whatsappOptIn??false},${status},${approvalStatus}) RETURNING *`,[]):[]; if(rows[0])return rows[0] as Order; const order={id:memory.orders.length+1,user_id:userId,stripe_session_id:stripeSessionId??null,slug,product_name:productName,amount,phone:phone??null,whatsapp_opt_in:whatsappOptIn??false,auto_email:true,status,approval_status:approvalStatus,walkthrough_status:"not_started",walkthrough_url:null,notes:null,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};memory.orders.push(order);return order; }
export async function findOrdersByUserId(userId:number):Promise<Order[]>{await initializeDatabase();return sql?await db(sql`SELECT * FROM orders WHERE user_id=${userId} ORDER BY created_at DESC`,[]):memory.orders.filter(o=>o.user_id===userId);}
export async function findOrderByStripeSession(id:string):Promise<Order|undefined>{await initializeDatabase();const rows=sql?await db(sql`SELECT * FROM orders WHERE stripe_session_id=${id} LIMIT 1`,[]):memory.orders.filter(o=>o.stripe_session_id===id);return rows[0] as Order|undefined;}
export async function findOrderById(id:number){await initializeDatabase();const rows=sql?await db(sql`SELECT * FROM orders WHERE id=${id} LIMIT 1`,[]):memory.orders.filter(o=>o.id===id);return rows[0] as Order|undefined;}
export async function findUserByEmailOrCreate(email:string,name:string,passwordHash:string){return (await findUserByEmail(email))??await createUser(email,name,passwordHash);}

async function updateOrder(id:number, field:string, value:any){await initializeDatabase();if(sql){if(field==="status")await db(sql`UPDATE orders SET status=${value},updated_at=NOW() WHERE id=${id}`,null);if(field==="approval_status")await db(sql`UPDATE orders SET approval_status=${value},updated_at=NOW() WHERE id=${id}`,null);if(field==="stripe_session_id")await db(sql`UPDATE orders SET stripe_session_id=${value},updated_at=NOW() WHERE id=${id}`,null);if(field==="auto_email")await db(sql`UPDATE orders SET auto_email=${value},updated_at=NOW() WHERE id=${id}`,null);if(field==="walkthrough_status")await db(sql`UPDATE orders SET walkthrough_status=${value},updated_at=NOW() WHERE id=${id}`,null);if(field==="walkthrough_url")await db(sql`UPDATE orders SET walkthrough_url=${value},updated_at=NOW() WHERE id=${id}`,null);if(field==="notes")await db(sql`UPDATE orders SET notes=${value},updated_at=NOW() WHERE id=${id}`,null);} }
export async function updateOrderStatus(id:number,v:string){return updateOrder(id,"status",v)} export async function updateOrderApprovalStatus(id:number,v:any){return updateOrder(id,"approval_status",v)} export async function updateOrderStripeSession(id:number,v:string){return updateOrder(id,"stripe_session_id",v)} export async function updateOrderAutoEmail(id:number,v:boolean){return updateOrder(id,"auto_email",v)} export async function updateWalkthroughStatus(id:number,v:string){return updateOrder(id,"walkthrough_status",v)} export async function updateWalkthroughUrl(id:number,v:string){return updateOrder(id,"walkthrough_url",v)} export async function updateOrderNotes(id:number,v:string){return updateOrder(id,"notes",v)}

export async function updateUserPhone(id:number,phone:string){await initializeDatabase();if(sql)await db(sql`UPDATE users SET phone=${phone||null} WHERE id=${id}`,null);}
export async function findAllUsers():Promise<User[]>{await initializeDatabase();return sql?await db(sql`SELECT * FROM users ORDER BY created_at DESC`,[]):memory.users;}
export async function findAllOrders():Promise<any[]>{await initializeDatabase();return sql?await db(sql`SELECT o.*,u.email as user_email,u.name as user_name,u.phone as user_phone FROM orders o LEFT JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC`,[]):memory.orders.map(o=>({...o,user_email:memory.users.find(u=>u.id===o.user_id)?.email??"unknown",user_name:memory.users.find(u=>u.id===o.user_id)?.name??"unknown",user_phone:memory.users.find(u=>u.id===o.user_id)?.phone??null}));}

// Image requests
export async function createImageRequest(orderId:number, message:string): Promise<ImageRequest> {
  await initializeDatabase();
  const rows=sql?await db(sql`INSERT INTO image_requests(order_id,message) VALUES(${orderId},${message}) RETURNING *`,[]):[];
  if(rows[0]) return rows[0] as ImageRequest;
  const req={id:1,order_id:orderId,message,status:"pending",created_at:new Date().toISOString()};
  return req;
}
export async function findImageRequestsByOrderId(orderId:number): Promise<ImageRequest[]> {
  await initializeDatabase();
  return sql?await db(sql`SELECT * FROM image_requests WHERE order_id=${orderId} ORDER BY created_at DESC`,[]):[];
}
export async function findImageRequestsByUserId(userId:number): Promise<(ImageRequest & {product_name:string})[]> {
  await initializeDatabase();
  return sql?await db(sql`SELECT ir.*, o.product_name FROM image_requests ir JOIN orders o ON o.id=ir.order_id WHERE o.user_id=${userId} ORDER BY ir.created_at DESC`,[]):[];
}
export async function findImageRequestById(id:number): Promise<ImageRequest|undefined> {
  await initializeDatabase();
  const rows=sql?await db(sql`SELECT * FROM image_requests WHERE id=${id} LIMIT 1`,[]):[];
  return rows[0] as ImageRequest|undefined;
}
export async function updateImageRequestStatus(id:number, status:string) {
  await initializeDatabase();
  if(sql) await db(sql`UPDATE image_requests SET status=${status} WHERE id=${id}`,null);
}

// Uploaded images
export async function createUploadedImage(requestId:number, userId:number, filename:string, url:string, size:number): Promise<UploadedImage> {
  await initializeDatabase();
  const rows=sql?await db(sql`INSERT INTO uploaded_images(request_id,user_id,filename,url,size) VALUES(${requestId},${userId},${filename},${url},${size}) RETURNING *`,[]):[];
  if(rows[0]) return rows[0] as UploadedImage;
  return {id:1,request_id:requestId,user_id:userId,filename,url,size,created_at:new Date().toISOString()};
}
export async function findUploadedImagesByRequestId(requestId:number): Promise<UploadedImage[]> {
  await initializeDatabase();
  return sql?await db(sql`SELECT * FROM uploaded_images WHERE request_id=${requestId} ORDER BY created_at DESC`,[]):[];
}
export async function findUploadedImagesByOrderId(orderId:number): Promise<UploadedImage[]> {
  await initializeDatabase();
  return sql?await db(sql`SELECT ui.* FROM uploaded_images ui JOIN image_requests ir ON ir.id=ui.request_id WHERE ir.order_id=${orderId} ORDER BY ui.created_at DESC`,[]):[];
}
