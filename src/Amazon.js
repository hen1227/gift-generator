const generateAmazonLink = (product) => {
    const productString = product.replace(/ /g, '+')
    return `https://www.amazon.com/s?k=${productString}&_encoding=UTF8&tag=henhen12270a-20&linkCode=ur2&linkId=6ab8f81237ac6171ba05d4e57cd2d9a7&camp=1789&creative=9325`
}

export default generateAmazonLink;