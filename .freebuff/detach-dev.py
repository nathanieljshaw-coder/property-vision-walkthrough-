import os, sys

ROOT = "/Users/nathanieljshaw/Downloads/property-vision-walkthrough-main"
LOG = os.path.join(ROOT, ".freebuff/preview-dc631f9c-daa8-4ec7-bac6-42a8082287a3.log")

# First fork: detach from the runner's process group
pid = os.fork()
if pid > 0:
    sys.exit(0)
os.setsid()
# Second fork: guarantee we're not a session leader (can never reacquire a tty)
pid = os.fork()
if pid > 0:
    sys.exit(0)

os.chdir(ROOT)
fd = os.open(LOG, os.O_WRONLY | os.O_CREAT | os.O_APPEND, 0o644)
os.dup2(fd, 1)
os.dup2(fd, 2)
devnull = os.open(os.devnull, os.O_RDONLY)
os.dup2(devnull, 0)
os.execv(os.path.join(ROOT, ".freebuff/bun"), ["bun", "run", "dev"])
