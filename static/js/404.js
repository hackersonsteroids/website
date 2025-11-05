// Joke rotator
const jokes = [
"Why did the developer go broke? Because they used up all their cache.",
"I told my computer I needed a break… it said 'error 429: too many requests'.",
"Why do Java developers wear glasses? Because they don't C#.",
"My password is the last 8 digits of pi. Good luck.",
"Parallel lines have so much in common. It's a shame they'll never meet.",
"I would tell you a UDP joke, but you might not get it.",
"I tried to catch fog yesterday. Mist."
];

const jokeBox = document.getElementById("jokeBox");
const jokeText = document.getElementById("jokeText");

function setJoke() {
const joke = jokes[Math.floor(Math.random() * jokes.length)];
jokeText.textContent = joke;
}
setJoke();
setInterval(setJoke, 7000);

// Timestamp
document.getElementById("ts").textContent = new Date().toLocaleString();

// Interactive Terminal
class Terminal {
constructor(element) {
  this.element = element;
  this.history = [];
  this.historyIndex = -1;
  this.commandHistory = [];
  this.currentInput = null;
  this.isReady = false;
  
  this.commands = {
    help: () => this.showHelp(),
    clear: () => this.clear(),
    whoami: () => this.output('→ suspicious individual detected.', 'info'),
    ls: () => this.listFiles(),
    cat: (args) => this.catFile(args),
    hack: () => this.hack(),
    sudo: (args) => this.sudo(args),
    exit: () => this.output('nice try. you\'re not going anywhere.', 'error'),
    ping: (args) => this.ping(args),
    date: () => this.output(new Date().toString()),
    echo: (args) => this.output(args.join(' ')),
    history: () => this.showHistory(),
    about: () => this.about(),
    secret: () => this.secret(),
    matrix: () => this.matrix(),
  };

  this.init();
}

init() {
  // Boot sequence
  const bootMsgs = [
    "[SECURITY] unauthorized viewport discovered…",
    "[SYS] granting temporary guest privileges…",
    "[TIP] type 'help' to see available commands.",
  ];

  let i = 0;
  const bootInterval = setInterval(() => {
    if (i >= bootMsgs.length) {
      clearInterval(bootInterval);
      setTimeout(() => {
        this.isReady = true;
        this.createInputLine();
      }, 300);
      return;
    }
    this.output(bootMsgs[i], 'info');
    i++;
  }, 800);

  // Click anywhere in terminal to focus
  this.element.addEventListener('click', () => {
    if (this.currentInput) {
      this.currentInput.focus();
    }
  });
}

output(text, className = '') {
  const line = document.createElement('div');
  if (className) line.className = className;
  line.textContent = text;
  this.element.appendChild(line);
  this.scrollToBottom();
}

outputHTML(html) {
  const line = document.createElement('div');
  line.innerHTML = html;
  this.element.appendChild(line);
  this.scrollToBottom();
}

createInputLine() {
  const container = document.createElement('div');
  container.className = 'input-line';
  
  const prompt = document.createElement('span');
  prompt.innerHTML = '<span class="prompt">guest@hos</span>:<span style="color:#fff">~</span>$ ';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'commandInput';
  input.autocomplete = 'off';
  input.spellcheck = false;
  
  container.appendChild(prompt);
  container.appendChild(input);
  this.element.appendChild(container);
  
  this.currentInput = input;
  input.focus();
  
  input.addEventListener('keydown', (e) => this.handleKeyDown(e));
  this.scrollToBottom();
}

handleKeyDown(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const command = this.currentInput.value.trim();
    
    if (command) {
      this.commandHistory.push(command);
      this.historyIndex = this.commandHistory.length;
      
      // Echo the command
      const line = document.createElement('div');
      line.innerHTML = `<span class="prompt">guest@hos</span>:<span style="color:#fff">~</span>$ ${command}`;
      this.element.insertBefore(line, this.currentInput.parentElement);
      
      // Execute command
      this.executeCommand(command);
    }
    
    this.currentInput.value = '';
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.currentInput.value = this.commandHistory[this.historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      this.currentInput.value = this.commandHistory[this.historyIndex];
    } else {
      this.historyIndex = this.commandHistory.length;
      this.currentInput.value = '';
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    this.autocomplete();
  }
}

executeCommand(input) {
  const parts = input.split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (this.commands[cmd]) {
    this.commands[cmd](args);
  } else if (input.includes('rm -rf')) {
    this.output('⚠️  permission denied. also, rude.', 'error');
  } else {
    this.output(`command not found: ${cmd}. type 'help' for available commands.`, 'error');
  }
}

autocomplete() {
  const value = this.currentInput.value;
  const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(value));
  
  if (matches.length === 1) {
    this.currentInput.value = matches[0];
  } else if (matches.length > 1) {
    this.output(matches.join('  '), 'info');
  }
}

showHelp() {
  const helpText = `
<div class="success">Available Commands:</div>
<span class="info">help</span>      - show this help message
<span class="info">clear</span>     - clear the terminal
<span class="info">whoami</span>    - display current user info
<span class="info">ls</span>        - list directory contents
<span class="info">cat</span>       - display file contents (try: cat note.txt)
<span class="info">hack</span>      - initiate hacking sequence
<span class="info">sudo</span>      - execute command as superuser
<span class="info">ping</span>      - ping a host
<span class="info">date</span>      - display current date/time
<span class="info">echo</span>      - print text to terminal
<span class="info">history</span>   - show command history
<span class="info">about</span>     - about this terminal
<span class="info">exit</span>      - attempt to exit (spoiler: you can't)

<div style="color:var(--muted)">Pro tips: Use ↑↓ for history, Tab for autocomplete</div>`;
  this.outputHTML(helpText);
}

clear() {
  const inputLine = this.currentInput.parentElement;
  this.element.innerHTML = '';
  this.element.appendChild(inputLine);
  this.currentInput.focus();
}

listFiles() {
  const files = `
<span class="info">total 42</span>
drwxr-xr-x  2 guest guest  4096 Nov  5 2025 <span class="success">.</span>
drwxr-xr-x  5 root  root   4096 Nov  5 2025 <span class="success">..</span>
-rw-r--r--  1 guest guest   220 Nov  5 2025 note.txt
-rw-r--r--  1 guest guest    42 Nov  5 2025 secrets.txt
-rwxr-xr-x  1 guest guest  1337 Nov  5 2025 <span class="success">definitely_not_malware.sh</span>
-rw-r--r--  1 guest guest     0 Nov  5 2025 README.md`;
  this.outputHTML(files);
}

catFile(args) {
  const fileName = args[0];
  const files = {
    'note.txt': 'hi. you\'re not supposed to see this page.\nsince you are here, enjoy the interactive terminal!\n- management',
    'secrets.txt': 'the cake is a lie.\nalso, the password is: hunter2',
    'definitely_not_malware.sh': '#!/bin/bash\n# This is totally legitimate software\necho "Installing..." && sleep 2 && echo "Just kidding! ✨"',
    'README.md': '# HOS Terminal\n\nWelcome to the most sophisticated terminal that does absolutely nothing productive.\n\n## Warning\nMay contain traces of humor.',
  };

  if (!fileName) {
    this.output('cat: missing file operand', 'error');
  } else if (files[fileName]) {
    this.output(files[fileName]);
  } else {
    this.output(`cat: ${fileName}: No such file or directory`, 'error');
  }
}

async hack() {
  const msgs = [
    'Initializing hack sequence...',
    'Bypassing firewall...',
    'Accessing mainframe...',
    'Downloading database...',
    'Encrypting connection...',
    'HACK SUCCESSFUL ✓',
  ];

  for (const msg of msgs) {
    await new Promise(resolve => setTimeout(resolve, 600));
    this.output(msg, msg.includes('✓') ? 'success' : 'info');
  }
  this.output('Just kidding. You hacked nothing. But nice try! 😎');
}

sudo(args) {
  const cmd = args.join(' ');
  if (!cmd) {
    this.output('sudo: no command specified', 'error');
  } else {
    this.output(`[sudo] password for guest: `, 'error');
    this.output('sudo: guest is not in the sudoers file. This incident will be reported.', 'error');
    this.output('(reported to: /dev/null)', 'info');
  }
}

ping(args) {
  const host = args[0] || 'localhost';
  this.output(`PING ${host} (127.0.0.1): 56 data bytes`);
  this.output(`64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms`);
  this.output(`64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms`);
  this.output(`\n--- ${host} ping statistics ---`);
  this.output(`2 packets transmitted, 2 packets received, 0.0% packet loss`);
}

showHistory() {
  if (this.commandHistory.length === 0) {
    this.output('no commands in history yet!', 'info');
  } else {
    this.commandHistory.forEach((cmd, i) => {
      this.output(`  ${i + 1}  ${cmd}`);
    });
  }
}

about() {
  this.outputHTML(`
<div class="success">HOS Interactive Terminal v0.0.1-prealpha</div>
<div>A completely unnecessary but somewhat fun terminal emulator.</div>
<div style="color:var(--muted); margin-top:0.5rem;">
Made with questionable decisions and too much coffee.
Type <span class="info">'secret'</span> if you dare...
</div>`);
}

secret() {
  this.outputHTML(`
<div class="success">🎉 You found the secret command! 🎉</div>
<div style="color:var(--muted);">
Here's your reward: Nothing. Absolutely nothing.
But hey, you're curious, and that's what counts!
</div>
<div style="margin-top:0.5rem;">
Try typing: <span class="info">matrix</span>
</div>`);
}

async matrix() {
  const chars = '01ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';
  this.output('Entering the Matrix...', 'success');
  
  for (let i = 0; i < 8; i++) {
    let line = '';
    for (let j = 0; j < 40; j++) {
      line += chars[Math.floor(Math.random() * chars.length)];
    }
    await new Promise(resolve => setTimeout(resolve, 100));
    this.output(line, 'success');
  }
  
  this.output('\nWake up, Neo...', 'info');
}

scrollToBottom() {
  this.element.scrollTop = this.element.scrollHeight;
}
}

// Initialize terminal
const terminal = new Terminal(document.getElementById('terminal'));