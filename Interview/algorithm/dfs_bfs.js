const tree = {
  left: {
    right: {
      left: {
        data: 'G',
      },
      data: 'D',
    },
    data: 'B',
  },
  right: {
    left: {
      data: 'E',
    },
    right: {
      data: 'F',
    },
    data: 'C',
  },
  data: 'A',
};

function visit(node: Node) {
  console.log(node.data);
}

function bfs(tree) {
  let q = [];
  (function _(node) {
    visit(node);
    if (node.left) q.push(node.left);
    if (node.right) q.push(node.right);
    if (q.length) _(q.shift());
  })(tree);
}

function dfs(tree) {
  let node = tree;
  visit(node);
  if (node.left) dfs(node.left);
  if (node.right) dfs(node.right);
}

bfs(tree);

dfs(tree);
