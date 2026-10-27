export const CATALOGUE_PATH = "/catalogue" as const;

/** Opens catalogue and starts PDF download after load. */
export const CATALOGUE_DOWNLOAD_PATH = `${CATALOGUE_PATH}?download=1` as const;

export const CATALOGUE_PDF_FILENAME = "Oviron-Legacy-Catalogue.pdf";
