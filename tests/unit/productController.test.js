const Product = require("../../models/Product");
const Review = require("../../models/Review");

jest.mock("../../models/Product");
jest.mock("../../models/Review");

const {
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../../controllers/productController");

describe("Product Controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    next = jest.fn();

    req = {
      params: {
        id: "123",
      },
      body: {
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stock: 5,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should return product by id", async () => {
    const mockProduct = {
      _id: "123",
      name: "iPhone 15",
      price: 35000,
    };

    const mockReviews = [
      {
        _id: "1",
        comment: "Good",
      },
    ];

    Product.findById.mockResolvedValue(mockProduct);

    Review.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockReviews),
    });

    await getProductById(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith("123");

    expect(Review.find).toHaveBeenCalledWith({
      product: "123",
    });

    expect(res.json).toHaveBeenCalledWith({
      product: mockProduct,
      reviews: mockReviews,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if product not found", async () => {
    Product.findById.mockResolvedValue(null);

    await getProductById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(next).toHaveBeenCalled();
  });

  it("should create product successfully", async () => {
    req.body = {
      name: "iPhone 15",
      description: "Apple smartphone",
      price: 35000,
      stock: 10,
      category: "cat123",
    };

    req.user = {
      _id: "user123",
    };

    req.file = {
      filename: "iphone.jpg",
    };

    const mockProduct = {
      _id: "product123",
      ...req.body,
      image: "iphone.jpg",
      user: "user123",
    };

    Product.create.mockResolvedValue(mockProduct);

    await createProduct(req, res, next);

    expect(Product.create).toHaveBeenCalledWith({
      name: "iPhone 15",
      description: "Apple smartphone",
      price: 35000,
      stock: 10,
      category: "cat123",
      image: "iphone.jpg",
      user: "user123",
    });

    expect(res.status).toHaveBeenCalledWith(201);

    expect(res.json).toHaveBeenCalledWith(mockProduct);
  });

  it("should create product with null image if no file uploaded", async () => {
    req.body = {
      name: "iPhone 15",
      description: "Apple smartphone",
      price: 35000,
      stock: 10,
      category: "cat123",
    };

    req.user = {
      _id: "user123",
    };

    req.file = null;

    Product.create.mockResolvedValue({
      _id: "123",
      ...req.body,
      image: null,
    });

    await createProduct(req, res, next);

    expect(Product.create).toHaveBeenCalledWith(
      expect.objectContaining({
        image: null,
      }),
    );
  });

  it("should update product successfully", async () => {
    req.params.id = "123";

    req.body = {
      name: "Updated iPhone",
      description: "Updated Description",
      price: 40000,
      stock: 20,
    };

    const updatedProduct = {
      _id: "123",
      ...req.body,
    };

    Product.findByIdAndUpdate.mockResolvedValue(updatedProduct);

    await updateProduct(req, res, next);

    expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      {
        name: "Updated iPhone",
        description: "Updated Description",
        price: 40000,
        stock: 20,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    expect(res.json).toHaveBeenCalledWith(updatedProduct);
  });

  it("should return 404 if product does not exist", async () => {
    Product.findByIdAndUpdate.mockResolvedValue(null);

    await updateProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(next).toHaveBeenCalled();
  });

  it("should delete product successfully", async () => {
    req.params.id = "123";

    req.user = {
      _id: "user123",
    };

    Product.findById.mockResolvedValue({
      _id: "123",
      user: "user123",
    });

    Product.findByIdAndDelete.mockResolvedValue({});

    await deleteProduct(req, res, next);

    expect(Product.findById).toHaveBeenCalledWith("123");

    expect(Product.findByIdAndDelete).toHaveBeenCalledWith("123");

    expect(res.json).toHaveBeenCalledWith({
      message: "Product Deleted",
    });
  });

  it("should return 404 if product not found", async () => {
    req.user = {
      _id: "user123",
    };

    Product.findById.mockResolvedValue(null);

    await deleteProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);

    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if user is not owner", async () => {
    req.user = {
      _id: "user123",
    };

    Product.findById.mockResolvedValue({
      _id: "123",
      user: "another-user",
    });

    await deleteProduct(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);

    expect(next).toHaveBeenCalled();
  });
});
