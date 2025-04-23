// Additional tests for Filter component
test("renders the correct default option in the select dropdown", () => {
  render(<Filter onCategoryChange={noop} />);
  expect(screen.queryByText("Filter by category")).toBeInTheDocument();
});

test("calls the onCategoryChange callback prop when a category is selected", () => {
  const onCategoryChange = jest.fn();
  render(<Filter onCategoryChange={onCategoryChange} />);

  fireEvent.change(screen.queryByRole("combobox"), {
    target: { value: "Dairy" },
  });

  expect(onCategoryChange).toHaveBeenCalled();
  expect(onCategoryChange).toHaveBeenCalledWith(expect.any(Object));
});

test("renders all category options in the select dropdown", () => {
  render(<Filter onCategoryChange={noop} />);
  const options = screen.queryAllByRole("option");
  expect(options).toHaveLength(4);
  expect(options.map((option) => option.value)).toEqual([
    "All",
    "Produce",
    "Dairy",
    "Dessert",
  ]);
});

test("the input field acts as a controlled input", () => {
  render(<ShoppingList items={testData} />);

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "testing 123" },
  });

  expect(screen.queryByPlaceholderText(/Search/).value).toBe("testing 123");
});

// Shopping List
test("the shopping list displays all items when initially rendered", () => {
  const { container } = render(<ShoppingList items={testData} />);
  expect(container.querySelector(".Items").children).toHaveLength(
    testData.length
  );
});

test("the shopping filters based on the search term to include full matches", () => {
  render(<ShoppingList items={testData} />);

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "Yogurt" },
  });

  expect(screen.queryByText("Yogurt")).toBeInTheDocument();
  expect(screen.queryByText("Lettuce")).not.toBeInTheDocument();

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "Lettuce" },
  });

  expect(screen.queryByText("Lettuce")).toBeInTheDocument();
  expect(screen.queryByText("Yogurt")).not.toBeInTheDocument();
});

test("the shopping filters based on the search term to include partial matches", () => {
  render(<ShoppingList items={testData} />);

  fireEvent.change(screen.queryByPlaceholderText(/Search/), {
    target: { value: "Cheese" },
  });

  expect(screen.queryByText("Swiss Cheese")).toBeInTheDocument();
  expect(screen.queryByText("String Cheese")).toBeInTheDocument();
  expect(screen.queryByText("Lettuce")).not.toBeInTheDocument();
  expect(screen.queryByText("Yogurt")).not.toBeInTheDocument();
});
