class PromiseExample {
    constructor(executionFunction){
        this.promiseChain = [];
        this.handleError = () => {};

        this.onResolve = this.onResolve.bind(this);
        this.onReject = this.onReject.bind(this);
        
        executionFunction(this.onResolve, this.onReject);
    }

    then(handleSuccess){
        this.promiseChain.push(handleSuccess);

        return this;
    }

    catch(handleError){
        this.handleError = handleError;

        return this;
    }

    onResolve(value){
        let storedValue = value;
    }
}