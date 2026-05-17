import pty
import os
import sys
import time

password = "Manya@007"
pub_key = open(os.path.expanduser("~/.ssh/id_rsa.pub")).read().strip()

setup_cmd = f"""
mkdir -p ~/.ssh && 
echo "{pub_key}" >> ~/.ssh/authorized_keys && 
chmod 600 ~/.ssh/authorized_keys &&
apt-get update && 
apt-get install -y docker.io docker-compose
"""

pid, fd = pty.fork()
if pid == 0:
    os.execvp('ssh', ['ssh', '-o', 'StrictHostKeyChecking=no', 'root@194.163.162.240', setup_cmd])
else:
    time.sleep(2)
    os.write(fd, (password + '\n').encode())
    while True:
        try:
            data = os.read(fd, 1024)
            if not data: break
            sys.stdout.write(data.decode())
            sys.stdout.flush()
        except OSError: break
    os.waitpid(pid, 0)
