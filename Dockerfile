FROM fedora:latest as builder

RUN dnf install nodejs bzip2 pbzip2 tar git -y

RUN npm install -g pnpm

COPY .git /root/iccoc.git

RUN git clone /root/iccoc.git /root/iccoc 

COPY out/iccoc.tar.bz2 /root/

WORKDIR /root/iccoc

RUN tar xf /root/iccoc.tar.bz2 2>/dev/null; exit 0

RUN pnpm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp" && \
    pnpm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"

RUN pnpm install && pnpm prisma generate && pnpm build

RUN tar c node_modules/ .next/ prisma/ public/ docker-compose.yml package.json next.config.mjs | pbzip2 -c > iccoc.tar.bz2

FROM scratch as output

COPY --from=builder /root/iccoc/iccoc.tar.bz2 ./
