# OS
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# Deno install
ENV DENO_INSTALL=/deno
RUN mkdir -p /deno \
    && curl -fsSL https://deno.land/x/install/install.sh | sh \
    && chown -R vscode /deno

ENV PATH=${DENO_INSTALL}/bin:${PATH} \
    DENO_DIR=${DENO_INSTALL}/.cache/deno

# Vercel install
RUN curl -fsSL https://deb.nodesource.com/setup_17.x | bash -\
    && apt-get update \
    && apt-get install -y nodejs build-essential \
    && npm i -g vercel

# Tiled install
COPY tiled/default.tiled-session /home/vscode/.local/share/tiled/
RUN wget -O /tmp/Tiled.AppImage https://github.com/mapeditor/tiled/releases/download/v1.7.2/Tiled-1.7.2-x86_64.AppImage \
    && chmod +x /tmp/Tiled.AppImage \
    && /tmp/Tiled.AppImage --appimage-extract \ 
    && mv squashfs-root /tiled \
    && chown -R vscode /tiled \
    && chmod +x /tiled/AppRun \
    && mkdir -p /home/vscode/.cache/tiled/sentry \
    && echo 1 > /home/vscode/.cache/tiled/sentry/user-consent

# Desktop lite
COPY library-scripts/desktop-lite-debian.sh /tmp/library-scripts/
COPY fluxbox /home/vscode/.fluxbox/
RUN apt-get update \
    && bash /tmp/library-scripts/desktop-lite-debian.sh \
    && chown -R vscode /home/vscode
ENV DBUS_SESSION_BUS_ADDRESS="autolaunch:" \
    VNC_RESOLUTION="1440x768x16" \
    VNC_DPI="96" \
    VNC_PORT="5901" \
    NOVNC_PORT="6080" \
    DISPLAY=":1" \
    LANG="en_US.UTF-8" \
    LANGUAGE="en_US.UTF-8"
ENTRYPOINT ["/usr/local/share/desktop-init.sh"]
CMD ["sleep", "infinity"]