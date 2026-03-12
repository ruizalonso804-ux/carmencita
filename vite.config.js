import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'fs';

function copySectionsPlugin() {
  return {
    name: 'copy-sections',
    writeBundle(options) {
      const outDir = options.dir || 'dist';

      // Copy sections
      const sectionsDir = resolve(__dirname, 'sections');
      const outSections = resolve(outDir, 'sections');
      if (!existsSync(outSections)) mkdirSync(outSections, { recursive: true });
      readdirSync(sectionsDir).forEach((f) => {
        copyFileSync(resolve(sectionsDir, f), resolve(outSections, f));
      });

      // Copy styles
      const stylesDir = resolve(__dirname, 'styles');
      const outStyles = resolve(outDir, 'styles');
      if (!existsSync(outStyles)) mkdirSync(outStyles, { recursive: true });
      readdirSync(stylesDir).forEach((f) => {
        copyFileSync(resolve(stylesDir, f), resolve(outStyles, f));
      });

      // Copy noticias pages
      const noticiasDir = resolve(__dirname, 'noticias');
      const outNoticias = resolve(outDir, 'noticias');
      if (!existsSync(outNoticias)) mkdirSync(outNoticias, { recursive: true });
      readdirSync(noticiasDir).forEach((f) => {
        copyFileSync(resolve(noticiasDir, f), resolve(outNoticias, f));
      });
    },
  };
}

export default defineConfig({
  root: '.',
  publicDir: 'assets',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
  plugins: [copySectionsPlugin()],
  server: {
    port: 3000,
    open: true,
  },
});
