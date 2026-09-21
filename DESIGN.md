# Andreeva Consulting design direction

This is a bilingual, editorial brand site for beauty professionals navigating U.S. licensing. Its primary job is to earn trust and make a free consultation easy to book.

The supplied visual reference establishes the identity: white/ivory editorial surfaces, deep navy serif headlines, restrained antique gold actions, fine rules, and the founder portrait. The broad, photo-led hero is the signature element; subsequent sections stay quieter. Avoid invented badges, fake testimonials, aggressive gradients, and unsupported claims.

Runtime tokens live in `app/globals.css`: paper `#fffefd`, ivory `#f7f4ef`, navy `#14263a`, ink `#283443`, gold `#765b37`, rule `#ddd7ce`. Cormorant Garamond serves display text and Manrope body and utility text. Section headings and eyebrows share one scale; buttons share one component style. Responsive structure preserves the same content and booking action. Motion is a subtle hero reveal, disabled under reduced-motion preference.

The hero image is one full-bleed photographic surface, softened by a continuous left-to-right veil behind the copy; never introduce a separate colored rectangle or a hard image boundary. At narrow widths, place the image above the copy and let the three facts form legible rows. Service summaries stay equal-height within each grid row; their longer details open in a focused, scrollable sheet without reflowing neighboring cards. On mobile, the compact header retains the logo and language choice while a large-type menu exposes descriptive links and the booking action. These are layout behaviors, not new color or type tokens; `app/globals.css` remains the canonical runtime token source.
