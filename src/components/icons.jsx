// Iconos propios: trazo de 1.5 px, esquinas redondeadas, 24×24.
const Icon = ({ children, size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    {...props}
  >
    {children}
  </svg>
);

export const BagIcon = (p) => (
  <Icon {...p}>
    <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
  </Icon>
);

export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const PlusIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const MinusIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12h14" />
  </Icon>
);

export const ArrowDownIcon = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Icon>
);

export const ArrowRightIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
