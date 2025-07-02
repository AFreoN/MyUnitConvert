# **App Name**: OmniConvert

## Core Features:

- Responsive Layout: Two-panel responsive grid: Input editor with format autodetect badge on the left, and tabbed result pane (converted, diff, metadata) on the right. Collapsible sidebar listing all converters with fuzzy search.
- Auto-Detect Conversion: Automatically detect the input format when the user pastes data and suggest the most likely conversion using a tool.
- Tabbed Result Pane: Display the converted results, a diff panel to verify structure changes, and metadata about the conversion.
- Permalink Generation: Generate a one-click permalink (/#json2yaml?src=...) for easy sharing of conversions.
- Extensible Plugin API: Offer an extensible plugin API, so the community can contribute new converters by adding a single TS file.
- Offline Operation: Operate offline-first, ensuring all logic stays in the browser to maintain user privacy.
- Jump-to-converter Palette: Keyboard palette (<kbd>⌘/Ctrl</kbd> + <kbd>K</kbd>) to jump to any converter

## Style Guidelines:

- Primary color: Pink (#F44E77), based on the accent color visible in the reference image, will provide vibrancy and serves well for interactive elements.
- Background color: Light gray (#F0F2F5), a desaturated tint of the primary pink, creates a clean and unobtrusive backdrop for content.
- Accent color: Teal (#4ECDC4), analogous to pink but with a different hue, draws attention to key actions and elements.
- Body font: 'Inter', a sans-serif font that provides a modern, machined, objective, and neutral aesthetic, suitable for body text.
- Headline font: 'Poppins', a geometric sans-serif font with a precise, contemporary, fashionable, avant-garde look that matches the prompt and creates clear hierarchy.
- Animated format chips with slide-in effects to visually represent different data formats.
- Subtle elevation (shadow-md) to visually separate panels and content sections.