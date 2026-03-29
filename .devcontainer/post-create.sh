#!/bin/bash

# Exit immediately on error, treat unset variables as an error, and fail if any command in a pipeline fails.
set -euo pipefail

# Function to run a command and show logs only on error
run_command() {
    local command_to_run="$*"
    local output
    local exit_code
    
    # Capture all output (stdout and stderr)
    output=$(eval "$command_to_run" 2>&1) || exit_code=$?
    exit_code=${exit_code:-0}
    
    if [ $exit_code -ne 0 ]; then
        echo -e "\033[0;31m[ERROR] Command failed (Exit Code $exit_code): $command_to_run\033[0m" >&2
        echo -e "\033[0;31m$output\033[0m" >&2
        
        exit $exit_code
    fi
}

echo -e "\n🤖 Setting Global configuration..."
DEFAULT_THEME="agnoster"
ZSH_CUSTOM="${ZSH_CUSTOM:-${ZSH:-~/.oh-my-zsh}/custom}"
run_command "if grep -q '^ZSH_THEME=' ~/.zshrc 2>/dev/null; then sed -i.bak 's/^ZSH_THEME=.*/ZSH_THEME=\"$DEFAULT_THEME\"/' ~/.zshrc; else echo 'ZSH_THEME=\"$DEFAULT_THEME\"' >> ~/.zshrc; fi"
run_command "git clone https://github.com/zsh-users/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions"
run_command "sed -i 's/^plugins=(git)$/plugins=(git zsh-autosuggestions)/' ~/.zshrc"

echo "✅ Setup completed. Happy coding! 🚀"