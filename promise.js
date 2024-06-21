class PromiseExample {
    constructor(executionFunction){
        this.promiseChain = [];
        this.handleError = () => {};

        this.onResolve = this.onResolve.bind(this);
        this.onReject = this.onReject.bind(this);
        //Takes resolve and reject which map to the internal onResolve() and onReject()
        //These are called when the fetch calls the resolve or reject
        executionFunction(this.onResolve, this.onReject);
    }
//In the native Promise in JavaScript, then() and catch() return a new Promise
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

        try{
            this.promiseChain.forEach((nextFunction) => {
                storedValue = nextFunction(storedValue);
            });
        } catch (error) {
            this.promiseChain = [];
            
            this.onReject(error);
        }
    }

    onReject(error){
        this.handleError(error);
    }
}

fakeApiBackend = () => {
    const user = {
        username: 'Justin',
        favoriteNumber: 9,
        profile: 'github.com/jdav892'
    };

    //Simulate error probability with randomization
    
}