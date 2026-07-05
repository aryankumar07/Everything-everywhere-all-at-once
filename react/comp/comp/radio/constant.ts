export type LayoutNode = {
  [key: string]: LayoutNode | null
}

export const layout: LayoutNode = {
  "electronic": {
    "mobile phones": {
      "iphone": null,
      "Android": null
    },
    "Laptops": {
      "Maccbook": null,
      "surface pro": null
    }
  },
  "books": {
    "fiction": null,
    "non fiction": null
  },
  "toys": null
}
