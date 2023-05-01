FROM fedora:latest as builder

RUN dnf install nodejs bzip2 tar git -y

RUN npm install -g pnpm

COPY .git /root/iccoc.git

RUN git clone /root/iccoc.git /root/iccoc 

WORKDIR /root/iccoc

RUN mkdir -p .next/cache

COPY out/cache /root/iccoc/.next/cache

RUN pnpm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp" && \
    pnpm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"

RUN pnpm install && pnpm prisma generate && pnpm build

RUN tar cjf iccoc.tar.bz2 node_modules/ .next/ prisma/ public/ docker-compose.yml package.json next.config.mjs

FROM scratch as output

COPY --from=builder /root/iccoc/iccoc.tar.bz2 ./

COPY --from=builder /root/iccoc/.next/cache ./cache
