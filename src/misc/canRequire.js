
module.exports = (name)=>{
    try {
        require.resolve(name);
        return true;
    } catch(e){
        console.log(e);
    }
    return false;
}