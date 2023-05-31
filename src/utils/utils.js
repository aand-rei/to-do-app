class Utils {

    static toLS(key, data){
        return localStorage.setItem(key, JSON.stringify(data));
    };

    static fromLS(key, defaultValue){
        return localStorage.getItem(key) !== null ? JSON.parse(localStorage.getItem(key)) : defaultValue;
    };

}

export default Utils;