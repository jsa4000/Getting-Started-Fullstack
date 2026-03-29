FROM node:25-trixie AS base

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y \
  curl \
  gpg \
  git \
  gosu \
  gh \
  jq \
  yq \
  gettext \
  unzip \
  # python3 \
  # python3-pip \
  # python3-venv \
  # chromium \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g corepack @go-task/cli --force

# Prepare the environment for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies only when needed
FROM base AS runner

USER node

WORKDIR /workspace

CMD [ "sleep", "infinity" ]