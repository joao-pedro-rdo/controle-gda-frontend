interface ColorsUpdateDetail {
  primaryColor: string;
  secondaryColor: string;
}

declare global {
  interface WindowEventMap {
    colorsUpdated: CustomEvent<ColorsUpdateDetail>;
  }
}