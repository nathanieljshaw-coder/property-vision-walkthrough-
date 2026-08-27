import os, sys, subprocess

os.setsid()

ROOT = "/Users/nathanieljshaw/Downloads/property-vision-walkthrough-main"
LOG = os.path.join(ROOT, ".freebuff/preview-dc631f9c-daa8-4ec7-bac6-42a8082287a3.log")

logf = open(LOG, "w")
os.dup2(logf.fileno(), 1)
os.dup2(logf.fileno(), 2)

os.chdir(ROOT)
os.execv(
    os.path.join(ROOT, ".freebuff/bun"),
    ["bun", "run", "dev"]
)
