const {Schema} = require("../src")

exports.schema = new Schema({
  nodes: {
    doc: {
      content: "block+"
    },

    paragraph: {
      content: "inline<_>*",
      group: "block",
      parseDOM: [{tag: "p"}],
      toDOM() { return ["p", 0] }
    },

    blockquote: {
      content: "block+",
      group: "block",
      parseDOM: [{tag: "blockquote"}],
      toDOM() { return ["blockquote", 0] }
    },

    horizontal_rule: {
      group: "block",
      parseDOM: [{tag: "hr"}],
      toDOM() { return ["div", ["hr"]] }
    },

    heading: {
      attrs: {level: {default: 1}},
      content: "inline<_>*",
      group: "block",
      parseDOM: [{tag: "h1", attrs: {level: 1}},
                 {tag: "h2", attrs: {level: 2}},
                 {tag: "h3", attrs: {level: 3}},
                 {tag: "h4", attrs: {level: 4}},
                 {tag: "h5", attrs: {level: 5}},
                 {tag: "h6", attrs: {level: 6}}],
      toDOM(node) { return ["h" + node.attrs.level, 0] }
    },

    code_block: {
      content: "text*",
      group: "block",
      code: true,
      parseDOM: [{tag: "pre", preserveWhitespace: true}],
      toDOM() { return ["pre", ["code", 0]] }
    },

    ordered_list: {
      content: "list_item+",
      group: "block",
      attrs: {order: {default: 1}},
      parseDOM: [{tag: "ol", getAttrs(dom) {
        return {order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1}
      }}],
      toDOM(node) {
        return ["ol", {start: node.attrs.order == 1 ? null : node.attrs.order}, 0]
      }
    },

    bullet_list: {
      content: "list_item+",
      group: "block",
      parseDOM: [{tag: "ul"}],
      toDOM() { return ["ul", 0] }
    },

    list_item: {
      content: "paragraph block*",
      parseDOM: [{tag: "li"}],
      toDOM() { return ["li", 0] }
    },

    text: {
      text: true,
      group: "inline",
      toDOM(node) { return node.text }
    },

    image: {
      inline: true,
      attrs: {
        src: {},
        alt: {default: ""},
        title: {default: ""}
      },
      group: "inline",
      draggable: true,
      parseDOM: [{tag: "img[src]", getAttrs(dom) {
        return {
          src: dom.getAttribute("src"),
          title: dom.getAttribute("title"),
          alt: dom.getAttribute("alt")
        }
      }}],
      toDOM(node) { return ["img", node.attrs] }
    },

    hard_break: {
      inline: true,
      group: "inline",
      selectable: false,
      isBR: true,
      parseDOM: [{tag: "br"}],
      toDOM() { return ["br"] }
    }
  },

  marks: {
    em: {
      parseDOM: [{tag: "i"}, {tag: "em"},
                 {style: "font-style", getAttrs: value => value == "italic" && null}],
      toDOM() { return ["em"] }
    },

    strong: {
      parseDOM: [{tag: "b"}, {tag: "strong"},
                 {style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
      toDOM() { return ["strong"] }
    },

    link: {
      attrs: {
        href: {},
        title: {default: ""}
      },
      parseDOM: [{tag: "a[href]", getAttrs(dom) {
        return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
      }}],
      toDOM(node) { return ["a", node.attrs] }
    },

    code: {
      parseDOM: [{tag: "code"}],
      toDOM() { return ["code"] }
    }
  }
})
