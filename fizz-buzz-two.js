const checkSyntax = (str) => {
  const steckCheck = [];
  const opening = ['<', '[', '{' , '('];
  const closing = ['>', ']', '}', ')'];

  for (let i = 0; i < str.length; i += 1) {
    if (closing.includes(str[i])) {
      if (steckCheck.length === 0) {
        return 1;
      }
      const index = closing.indexOf(str[i]);
      if (opening[index] === steckCheck[steckCheck.length - 1]) {
        steckCheck.pop();
      }
    }
    if (opening.includes(str[i])) {
      steckCheck.push(str[i]);
    }
  }

  if (steckCheck.length === 0) {
    return 0;
  }

  return 1;
}

function test(call, args, count, n) {
  let r = (call.apply(n, args) === count);
  console.assert(r, `Found items count: ${count}`);
  if (!r) throw "Test failed!";
}

try {
  test(checkSyntax, ["---(++++)----"], 0);
  test(checkSyntax, [""], 0);
  test(checkSyntax, ["before ( middle []) after "], 0);
  test(checkSyntax, [") ("], 1);
  test(checkSyntax, ["} {"], 1);
  test(checkSyntax, ["<(   >)"], 1);
  test(checkSyntax, ["(  [  <>  ()  ]  <>  )"], 0);
  test(checkSyntax, ["   (      [)"], 1);

  console.info("Congratulations! All tests passed.");
} catch(e) {
  console.error(e);
}
