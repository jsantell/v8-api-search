export function formatResults(matched, input, useMarkup) {
  const matcher = new RegExp(`(${input})`, 'i');
  return matched.map(({ name, ns, url }) => {
    let description = '';
    if (ns.substr(-2) === '()') {
      description = `${ns.substr(0, ns.length - 2)}`; 
    }
    else {
      description = ns && ns !== name ? ns : '';
      if (description && useMarkup) description = ` <dim>${description}</dim>`;
      else if (description) description = ` (${description})`;
      description = `${name}${description}`;
    }

    if (input) {
      let replacer = (useMarkup && input) ? '<match>$1</match>' : '$1';
      description = description.replace(matcher, replacer);
    }

    return {
      content: url,
      description,
    };
  });
}
