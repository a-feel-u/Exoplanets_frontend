import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function pagesWorker(): Plugin {
  return {
    name: 'exoplanets-pages-worker',
    apply: 'build',
    transformIndexHtml() {
      return [{ tag: 'link', attrs: { rel: 'manifest', href: './manifest.webmanifest' }, injectTo: 'head' }];
    },
    writeBundle({ dir }) {
      const output = resolve(dir ?? 'dist');
      const files = readdirSync(output, { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && !/\.(mp4|webm|map)$/i.test(entry.name))
        .map((entry) => join(entry.parentPath, entry.name).slice(output.length + 1))
        .sort();
      const worker = readFileSync(new URL('./scripts/pages-worker.js', import.meta.url), 'utf8');
      const hash = createHash('sha256').update(worker);
      for (const file of files) hash.update(readFileSync(join(output, file)));
      writeFileSync(join(output, 'sw.js'),
        `const CACHE = "exoplanets-pages-${hash.digest('hex').slice(0, 16)}";\n` +
        `const FILES = ${JSON.stringify(files)};\n` + worker);
    },
  };
}

export default defineConfig(({ mode }) => {
  const pages = mode === 'pages';
  const lan = mode === 'lan';
  return {
    base: pages ? '/Exoplanets_frontend/' : '/',
    plugins: [react(), ...(pages ? [pagesWorker()] : [])],
    server: {
      host: lan ? '0.0.0.0' : 'localhost',
      port: 3000,
      strictPort: true,
      https: lan ? {
        key: readFileSync(new URL('./.certs/lan-key.pem', import.meta.url)),
        cert: readFileSync(new URL('./.certs/lan-cert.pem', import.meta.url)),
      } : undefined,
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8080',
          changeOrigin: true,
        },
        '/s3': {
          target: 'http://127.0.0.1:9000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/s3(?=\/)/, ''),
        },
      },
    },
  };
});
