# Custom Gutenberg Blocks (Sage + Tailwind)

## Included blocks

- `event/hero`
- `event/services-grid`

## File structure

- `resources/blocks/<block-name>/block.json`
- `resources/blocks/<block-name>/index.js`
- `app/blocks.php` (server registration with `register_block_type_from_metadata`)
- `resources/js/editor.js` (imports and executes block `registerBlockType`)

## Enqueue/build flow in this theme

1. Block metadata is registered in PHP on `init`:
   - `app/blocks.php`
2. Block editor bundle is enqueued through existing Sage setup:
   - `app/setup.php` (`resources/js/editor.js`)
3. Build assets with Vite:

```bash
cd wordpress/wp-content/themes/event-theme
npm run build
```

4. During development:

```bash
cd wordpress/wp-content/themes/event-theme
npm run dev
```

## Multilingual placeholders (PL/EN)

Each block includes:

- `language`: default output language (`en` / `pl`)
- paired attributes like `headlineEn` and `headlinePl`

For list blocks like `services-grid`, arrays are editable directly in the block inspector.
