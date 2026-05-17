import pty
import os
import sys
import time

def run_ssh_command(password, cmd):
    pid, fd = pty.fork()
    if pid == 0:
        # Child process
        os.execvp('ssh', ['ssh', '-o', 'StrictHostKeyChecking=no', 'root@194.163.162.240', cmd])
    else:
        # Parent process
        time.sleep(2) # Wait for password prompt
        os.write(fd, (password + '\n').encode())
        
        output = b''
        while True:
            try:
                data = os.read(fd, 1024)
                if not data:
                    break
                output += data
                if b'password:' in data.lower():
                     os.write(fd, (password + '\n').encode())
            except OSError:
                break
        
        os.waitpid(pid, 0)
        return output.decode()

# Try to check if docker is installed
passw = "Manya@007"
print(run_ssh_command(passw, "docker --version"))
