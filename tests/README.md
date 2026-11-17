# Inspector regression checks

Serve the repository root on port 8864, then run:

```sh
npm install --prefix tests
npx --prefix tests playwright install chromium firefox webkit
npm test --prefix tests
```

Set `DASHLINE_URL` to test another development server. Set `BASE_REF` to a Git revision to additionally assert that all 419 icons and 77 canonical parts still export identical 192px raster images. Run from the repository root when setting `BASE_REF`.

The suite walks all inspector descendants, checks that each card maps to a real instance, decodes every extracted SVG, samples entry/return geometry, and rejects empty output or cycles. Pointer and keyboard regressions cover the two Swap arrows, terminal Bluetooth, entered-part usage lists, Fast charge and charging-battery preview-only interactions, interrupted returns and reduced motion in Chromium, WebKit and Firefox.

`inspector-relations.cjs` independently compares every usage list against SVG part markers, including mask references, and renders every usage card to reject empty or broken SVG output.
