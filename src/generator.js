//同步可迭代对象
let rangeOrigin = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    //实现一个可迭代对象，需要实现这方法。然后返回的是一个next函数
    let current = this.from;
    return {
      next: () => {
        //next方法里面有 {value:current,done:boolean} done标记是不是结束。
        if (current <= this.to) {
          return { value: this.current++, done: false };
        } else {
          return { done: true };
        }
      },
    };
  },
};
const runOrigin = () => {
  for (const item of rangeOrigin) {
    console.log(item);
  }
};
runOrigin();

//同步可迭代对象
let range = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for (let current = this.from; current <= this.to; current++) {
      yield current;
    }
  },
};
//异步可迭代对象。
let asyncRange = {
  from: 1,
  to: 5,
  async *[Symbol.asyncIterator]() {
    for (let current = this.from; current <= this.to; current++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      yield current;
    }
  },
};
const arr = "abc";

function* generateSequence() {
  yield 1;
  yield 2;
  return 3;
}

let generator = generateSequence();

const run = async () => {
  for await (const item of asyncRange) {
    console.log("item", item);
  }
};

run();
