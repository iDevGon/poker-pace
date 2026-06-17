# GTO Spots UI Design

## Goal

Expand the GTO reference screen from three curated situations to a broader beginner-friendly set, while keeping the 13 by 13 hand matrix readable and easier to tap on mobile.

## Scope

- Add common preflop situations to `gtoSpots`.
- Categorize spots so the selector does not become a long flat button list.
- Preserve the current matrix shape because it is useful for reading ranges at a glance.
- Increase matrix cell size and make the matrix panel scrollable when the viewport cannot fit it.

## Design

The GTO data model gains a `category` field with three initial values: `Open`, `Defend`, and `Vs 3-bet`. The screen renders category tabs first, then only the spots in the selected category. This keeps situation selection short as the data grows.

The matrix remains a 13 by 13 grid. Instead of shrinking every cell to fit the viewport, the grid uses fixed-size cells inside an overflow container. On small screens, users scroll the matrix area horizontally and vertically while the selected-hand details remain below the matrix.

## Success Criteria

- The GTO screen has at least eight common preflop spots.
- Every spot still has a complete 169-hand matrix.
- The spot selector is grouped by category.
- Matrix buttons have larger fixed dimensions and are contained in a scrollable region.
- Existing hand selection and frequency details continue to work.
