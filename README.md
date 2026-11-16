# Dashline

A rule-based cockpit icon system for automotive interfaces. Browse and search the library, then open any icon to copy its SVG.

[Open Dashline](https://paxton0209.github.io/Dashline/)

## Design references

[Paxton Design System](https://github.com/Paxton0209/paxton-design-system) maintains the shared design rules and tokens. For icon geometry and review, use the [HMI Icon Guidelines](https://github.com/Paxton0209/paxton-design-system/blob/main/icons/icon-guideline.en.md) ([中文版](https://github.com/Paxton0209/paxton-design-system/blob/main/icons/icon-guideline.md)).

In the browser library, full-icon off states use the STATE-01 slash: a 2 px stroke from (13, 13) to (35, 35) on the 48 px grid, with a 2 px clear gap on each side. The mark stays fixed when the underlying icon is optically resized. Circular prohibition badges and the mute X use their own geometry.

## Components

Open a component to see the icons that use it, or open an icon to jump to its components. These links come from the shared SVG geometry used to draw each icon.

To compose an icon in `index.html`, put `{{part/seat}}` where the component should be drawn. Wrap the call in an SVG group when the icon needs its own placement or scale. Use shared geometry for elements that carry the same meaning, such as the parking P. Keep each icon's optical adjustments in the composition. Line icons use a 2 px stroke on the final 48 px grid; compact details may use a lighter stroke to preserve their gaps. Copy SVG expands components and applies the same stroke rules as the preview.

The six PM2.5 tiles in Climate share a fixed-width colored reading badge with white numerals and a label below. They use example 24-hour concentrations in μg/m³ and the category colors from [HJ 633—2026](https://www.mee.gov.cn/ywgz/fgbz/bz/bzwb/jcffbz/202602/t20260225_1144441.shtml). The SVGs show visual examples rather than computing an AQI or representing live sensor readings.

## Local preview

To preview locally, run `python3 -m http.server 8000` from the repository root and open `http://localhost:8000`.
