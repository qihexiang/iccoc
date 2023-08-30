FROM fedora:latest as builder

RUN dnf install nodejs bzip2 pbzip2 tar git -y

RUN npm install -g pnpm

# RUN pnpm config set sharp_binary_host "https://npmmirror.com/mirrors/sharp" && \
#     pnpm config set sharp_libvips_binary_host "https://npmmirror.com/mirrors/sharp-libvips"

COPY .git /root/iccoc.git

WORKDIR /root

RUN git clone /root/iccoc.git /root/iccoc 

WORKDIR /root/iccoc

COPY package/iccoc.tar.bz2 /root/

RUN pbzip2 -d -c /root/iccoc.tar.bz2 2>/dev/null | tar x node_modules .next 2>/dev/null; exit 0

RUN pnpm install 
RUN pnpm prisma generate
RUN pnpm build

RUN tar c node_modules/ .next/ prisma/ docker-compose.yml package.json next.config.mjs | pbzip2 -c > iccoc.tar.bz2

FROM scratch as output

COPY --from=builder /root/iccoc/iccoc.tar.bz2 ./
