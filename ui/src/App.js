/* eslint "react/react-in-jsx-scope": "off" */
/* globals React ReactDOM */
/* eslint "react/jsx-no-undef": "off" */

const contentNode = document.getElementById('contents');


class ProductRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(url) {
    window.open(url, '_blank');
  }

  render() {
    const linkStyle = { textDecoration: 'underline', color: 'blue' };
    const { product } = this.props;
    return (
      <tr>
        <td>{product.Name}</td>
        <td>
          $
          {product.Price}
        </td>
        <td>{product.Category}</td>
        <td>
          <div
            role="button"
            style={linkStyle}
            tabIndex={0}
            onClick={() => { this.handleOnClick(product.image); }}
            onKeyDown={() => { this.handleOnClick(product.image); }}
          >
            {' '}
            View
          </div>
        </td>
      </tr>
    );
  }
}


function ProductTable(props) {
  const { products } = props;
  const productRows = products.map(
    product => <ProductRow key={product.id} product={product} />,
  );
  return (
    <table className="bordered-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Category</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>{ productRows }</tbody>
    </table>
  );
}


class ProductAdd extends React.Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.addProduct;
    const { createProduct } = this.props;
    createProduct({
      Name: form.name.value,
      Price: parseFloat(form.price.value.slice(1)),
      Category: form.category.value,
      Image: form.image.value,

    });
    form.name.value = '';
    form.category.value = '';
    form.price.value = form.price.defaultValue;
    form.image.value = '';
  }

  render() {
    return (
      <div>
        <form name="addProduct" onSubmit={this.handleSubmit}>
          <table className="form-table">
            <tbody>
              <tr>
                <td>
                  Name
                  <br />
                  <input type="text" name="name" placeholder="Name" />
                </td>
                <td>
                  Price
                  <br />
                  <input type="text" name="price" defaultValue="$" />
                </td>
              </tr>
              <tr>
                <td>
                  Category
                  {' '}
                  <br />
                  <select name="category">
                    <option value="Shirts">Shirts</option>
                    <option value="Jeans">Jeans</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Sweaters">Sweaters</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </td>
                <td>
                  Image URL
                  <br />
                  <input type="text" name="image" placeholder="Image" />
                </td>
              </tr>
            </tbody>
          </table>
          <button type="button">Add Product</button>
        </form>
      </div>
    );
  }
}


class ProductList extends React.Component {
  constructor() {
    super();
    this.state = { products: [] };
    this.createProduct = this.createProduct.bind(this);
    this.loadData = this.loadData.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
            productList {
            id Name Category Price Image
            }
        }`;

    const response = await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    const result = await response.json();
    if (result.data) {
      this.setState({ products: result.data.productList });
    }
  }

  async createProduct(newProduct) {
    const query = `mutation productAdd($newProduct: productInput!) {
            productAdd(product: $newProduct) {
              id
            }
          }`;
    await fetch(window.ENV.UI_API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { newProduct } }),
    });
    this.loadData();
  }

  render() {
    const allProducts = this.state.products;
    return (
      <div>
        <h1>My Company MyInventory</h1>
        Showing all available products
        <hr />
        <ProductTable products={allProducts} />
        <hr />
        Add a new product to inventory
        <hr />
        <ProductAdd createProduct={this.createProduct} />
      </div>
    );
  }
}

ReactDOM.render(<ProductList />, contentNode);
