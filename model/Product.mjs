export class Product {
    title;
    price;
    description;
    type;
    category;
    imgUrl;
    crystals;
    stock;
    variants;
    personalizationHint;

    constructor({
        title,
        price,
        description,
        type,
        category,
        imgUrl,
        crystals,
        variants,
        stock = 0,
        personalizationHint
    }) {
        this.title = String(title);
        this.price = Number(price);
        this.type = String(type);
        this.description = String(description);
        this.category = String(category);
        this.imgUrl = String(imgUrl);
        this.crystals = crystals;
        this.stock = stock;
        this.variants = variants;
        this.personalizationHint = personalizationHint;
    }
}
