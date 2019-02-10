/// <reference path="./rslPromise.ts"/>
/// <reference path="./utils.ts"/>

/**
 * @author Serkan YESILDAG
 */

namespace AsyncIterator {

  import Thenable = RslPromise.Thenable;
  import reject = RslPromise.reject;

  type Tuple<T, F extends AsyncFunction<T>> = { func: F, value: Thenable<T> };

  export interface AsyncFunction<T> {

    promise(result?: T): Thenable<T>;

    fail(result: any): T | Thenable<T>;

    always(): void;
  }

  export interface AsyncDoneFunction<T> extends AsyncFunction<T> {
    done(result: T): T | Thenable<T>;
  }

  export interface ExecutorOptions<T> {
    done(results: Array<T | Thenable<T>>): void;

    fail?(e: any): void;

    always?(): void;
  }

  export interface ConcurrentExecutorOptions<T> extends ExecutorOptions<T> {
    availableSlots?: number;
  }

  export class Executor<T, O extends ExecutorOptions<T>, F extends AsyncFunction<T>> {
    constructor(protected options: O, protected asyncFunctions?: Array<F>) {
    }

    public async run() {
      try {
        this.options.done(await this._run());
      } catch (e) {
        if (this.options.fail)
          this.options.fail(e);
        throw e;
      } finally {
        if (this.options.always)
          this.options.always();
      }
    }

    protected async _run(): Promise<Array<T | Thenable<T>>> {
      throw new Error("must be overridden");
    }
  }

  export class Sequential<T> extends Executor<T, ExecutorOptions<T>, AsyncFunction<T>> {

    constructor(options: ExecutorOptions<T>, ...asyncFunctions: Array<AsyncFunction<T>>) {
      super(options, asyncFunctions);
    }

    public async _run() {
      let asyncFunction: AsyncFunction<T>, result: T = null, results: Array<T> = [];
      for (asyncFunction of this.asyncFunctions) {
        try {
          result = await asyncFunction.promise(result);
        } catch (e) {
          result = await asyncFunction.fail(e);
        } finally {
          asyncFunction.always();
        }
        results.push(result);
      }

      return results;
    }
  }

  function shouldStop(availableSlots: number, index: number, length: number) {
    return availableSlots <= 0 || index >= length;
  }

  export class Concurrent<T> extends Executor<T, ConcurrentExecutorOptions<T>, AsyncFunction<T>> {

    constructor(options: ConcurrentExecutorOptions<T>, ...asyncFunctions: Array<AsyncFunction<T>>) {
      super(options, asyncFunctions);
      this.options.availableSlots = this.options.availableSlots || Number.MAX_VALUE;
    }

    public async _run() {
      let asyncFunction: AsyncFunction<T>,
        index: number = 0,
        length: number = this.asyncFunctions.length,
        availableSlots = this.options.availableSlots,
        result: T,
        results: Array<T> = [];

      let trigger = async () => {
        let thenables: Array<Tuple<T, AsyncFunction<T>>> = [], thenable: Tuple<T, AsyncFunction<T>>;

        if (shouldStop(availableSlots, index, length))
          return;

        while (!shouldStop(availableSlots, index, length)) {
          asyncFunction = this.asyncFunctions[index++];
          thenables.push({ func: asyncFunction, value: asyncFunction.promise() });
          --availableSlots;
        }

        for (thenable of thenables) {
          try {
            result = await thenable.value;
          } catch (e) {
            result = await thenable.func.fail(e);
          } finally {
            thenable.func.always();
          }
          results.push(result);
          ++availableSlots;
        }

        // noinspection JSIgnoredPromiseFromCall
        trigger();
      }

      // noinspection JSIgnoredPromiseFromCall
      trigger();

      return results;
    }
  }

  export class Parallel<T> extends Executor<T, ConcurrentExecutorOptions<T>, AsyncDoneFunction<T>> {

    constructor(options: ConcurrentExecutorOptions<T>, ...asyncFunctions: Array<AsyncDoneFunction<T>>) {
      super(options, asyncFunctions);
      this.options.availableSlots = this.options.availableSlots || Number.MAX_VALUE;
    }

    public async _run() {

      return RslPromise.create<Array<Thenable<T>>>((resolve, reject) => {

        let asyncFunction: AsyncDoneFunction<T>,
          failed = false,
          promise: Thenable<T>,
          promises: Array<Thenable<T>> = [],
          availableSlots = this.options.availableSlots,
          index: number = 0,
          length: number = this.asyncFunctions.length;

        let trigger = () => {
          let thenables: Array<Tuple<T, AsyncDoneFunction<T>>> = [], thenable: Tuple<T, AsyncDoneFunction<T>>;

          if (shouldStop(availableSlots, index, length) || failed) {
            if (!failed)
              resolve(promises);
            return;
          }

          while (!shouldStop(availableSlots, index, length)) {
            asyncFunction = this.asyncFunctions[index++];
            thenables.push({ func: asyncFunction, value: asyncFunction.promise() });
            --availableSlots;
          }

          for (thenable of thenables) {
            promise = thenable.value;
            asyncFunction = thenable.func;
            promises.push(thenable.value);
            promise.then((value: T) => {
              return asyncFunction.done(value);
            },
              (error: any) => {
                failed = true;
                reject(error);
                return asyncFunction.fail(error);
              });

            [promise.always, promise.finally].some((func: Function) => {
              let execute = Utils.isFunction(func);
              if (execute)
                func.call(promise, () => {
                  setTimeout(() => {
                    ++availableSlots;
                    trigger();
                  });
                  asyncFunction.always();
                });
              return execute;
            });
          }
        }

        trigger();
      });
    }
  }

  // let funcs: AsyncDoneFunction<string>[] = [];
  //
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach((i) => {
  //     funcs.push({
  //         promise(result) {
  //             return new Promise((resolve, reject) => {
  //                 setTimeout(() => {
  //                     if(i == 5)
  //                         reject('hello ' + i);
  //                     else
  //                         resolve('hello ' + i);
  //                 }, 1000);
  //             });
  //         },
  //         fail(result) {
  //             return result;
  //         },
  //         always() {
  //         },
  //         done(result) {
  //             console.log('done ' + result);
  //             return result;
  //         }
  //     } as AsyncDoneFunction<string>);
  // });
  //
  // let parallel = new Parallel<string>({
  //     done(results) {
  //         console.log("done " + results);
  //     },
  //     fail(e: any) {
  //         console.log("fail " + e);
  //     }
  //     //, availableSlots: 4
  // }, ...funcs);
  //
  // parallel.run();
}
