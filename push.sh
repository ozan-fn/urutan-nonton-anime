#!/bin/bash

# Mendefinisikan beberapa warna
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Menampilkan beberapa info
echo -e "${GREEN}Menjalankan npm build...${NC}"
cd api && npx tsc && cd ..
cd client && npm run build -- --emptyOutDir && cd ..
echo -e "${GREEN}npm build berhasil!${NC}"

echo -e "${BLUE}Menambahkan perubahan ke git...${NC}"
git add .
echo -e "${GREEN}git add berhasil!${NC}"

echo -e "${RED}Melakukan commit dengan pesan 'y'...${NC}"
git commit -m y
echo -e "${GREEN}git commit berhasil!${NC}"

echo -e "${GREEN}Melakukan push ke repository...${NC}"
git push
echo -e "${GREEN}git push berhasil!${NC}"

echo -e "${GREEN}DONE...${NC}"