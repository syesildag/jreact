/// <reference path="./functions.ts"/>

/**
 * @author Serkan YESILDAG
 */

export class InvocationContext {
  constructor(private index: number,
    private target: any,
    private propertyKey: string,
    private descriptor: TypedPropertyDescriptor<Function>,
    private method: Function,
    private args: Array<any>,
    private result: any) {
  }

  public getIndex() {
    return this.index;
  }

  public getTarget() {
    return this.target;
  }

  public getPropertyKey() {
    return this.propertyKey;
  }

  public getDescriptor() {
    return this.descriptor;
  }

  public getMethod() {
    return this.method;
  }

  public getArgs() {
    return this.args;
  }

  public getResult() {
    return this.result;
  }

  public proceed() {
    return this.method.apply(this.target, this.args);
  }

  public proceedWithCaution() {
    return this.index > 0 ? this.result : this.proceed();
  }
}

export function interceptors<I extends Interceptor>(...interceptors: Array<I>) {
  let interceptor: I;
  //INIT
  for (interceptor of interceptors)
    interceptor.init();
  return function (target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
    let method = descriptor.value;
    descriptor.value = (...args: Array<any>) => {
      let result: any, index = 0;
      //INTERCEPT
      for (interceptor of interceptors)
        result = interceptor.intercept(new InvocationContext(index++, target, propertyKey, descriptor, method, args, result));
      return result;
    }
  }
}

export class Interceptor implements Functions.Interceptor<InvocationContext>, Functions.Init {

  private enabled = false;

  constructor() {
  }

  public init() {
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public intercept(ctx: InvocationContext) {
    throw new Error('must be overridden');
  }
}

export class Logger extends Interceptor {

  private readonly start: string;
  private readonly end: string;

  constructor({ start = '', end = '' } = {}) {
    super();
    this.start = start;
    this.end = end;
  }

  public intercept(ctx: InvocationContext) {
    let result: any,
      { start, end } = this,
      target = ctx.getTarget(),
      propertyKey = ctx.getPropertyKey(),
      args = ctx.getArgs();

    if (this.start && this.isEnabled())
      console.log({ start, target, propertyKey, args });
    result = ctx.proceedWithCaution();
    if (this.end && this.isEnabled())
      console.log({ end, target, propertyKey, args, result });
    return result;
  }
}

export class Profiler extends Interceptor {

  constructor(private name: string) {
    super();
  }

  public intercept(ctx: InvocationContext) {
    let result: any, { name } = this;
    if (this.isEnabled()) console.time(name);
    result = ctx.proceedWithCaution();
    if (this.isEnabled()) console.timeEnd(name);
    return result;
  }
}
