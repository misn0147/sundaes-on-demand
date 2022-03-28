import { render, screen } from "../../../test-utils/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import { OrderDetailsProvider } from "../../../contexts/OrderDetails";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoops change", async () => {
    render(<Options optionType="scoops" />, { wrapper: OrderDetailsProvider });

    // make sure total starts out $0.00
    const scoopsSubtotal = screen.getByText("Scoops total: $", {
        exact: false,
    });
    expect(scoopsSubtotal).toHaveTextContent("0.00");

    // update vanilla scoops to 1 and check subtotal
    const vanillaInput = await screen.findByRole("spinbutton", {
        name: "Vanilla",
    });
    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "1");
    expect(scoopsSubtotal).toHaveTextContent("2.00");

    // update chocolate scoops to 2 and check subtotal
    const chocolateInput = await screen.findByRole("spinbutton", {
        name: "Chocolate",
    });
    userEvent.clear(chocolateInput);
    userEvent.type(chocolateInput, "2");
    expect(scoopsSubtotal).toHaveTextContent("6.00");
});

test("update toppings subtotal when scoops change", async () => {
    render(<Options optionType="toppings" />, {
        wrapper: OrderDetailsProvider,
    });

    // make sure total starts out $0.00
    const toppingsSubtotal = screen.getByText("Toppings total: $", {
        exact: false,
    });
    expect(toppingsSubtotal).toHaveTextContent("0.00");

    // select cherries checkbox and verify total
    const cherriesCheckbox = await screen.findByRole("checkbox", {
        name: "Cherries",
    });
    userEvent.click(cherriesCheckbox);
    expect(toppingsSubtotal).toHaveTextContent("1.50");

    // unselect cherries checkbox and verify total
    userEvent.click(cherriesCheckbox);
    expect(toppingsSubtotal).toHaveTextContent("0.00");
});

describe("grand total", () => {
    test("grand total starts at $0.00", () => {
        render(<OrderEntry />);
        const grandTotal = screen.getByRole("heading", {
            name: /grand total: \$/i,
        });
        expect(grandTotal).toHaveTextContent("0.00");
    });

    test("grand total updates properly if scoop is added first", async () => {
        render(<OrderEntry />);
        const grandTotal = screen.getByRole("heading", {
            name: /grand total: \$/i,
        });

        // add vanilla and expect grand total to be 4.00
        const vanillaInput = await screen.findByRole("spinbutton", {
            name: "Vanilla",
        });
        userEvent.clear(vanillaInput);
        userEvent.type(vanillaInput, "2");
        expect(grandTotal).toHaveTextContent("4.00");

        // add cherries and expect grand total to be 5.50
        const cherriesCheckbox = screen.getByRole("checkbox", {
            name: "Cherries",
        });
        userEvent.click(cherriesCheckbox);
        expect(grandTotal).toHaveTextContent("5.50");
    });

    test("grand total updates properly if topping is added first", async () => {
        render(<OrderEntry />);
        const grandTotal = screen.getByRole("heading", {
            name: /grand total: \$/i,
        });

        // add cherries and check grand total
        const cherriesCheckbox = await screen.findByRole("checkbox", {
            name: "Cherries",
        });
        userEvent.click(cherriesCheckbox);
        expect(grandTotal).toHaveTextContent("1.50");

        // add vanilla and expect grand total to be 5.50
        const vanillaInput = await screen.findByRole("spinbutton", {
            name: "Vanilla",
        });
        userEvent.clear(vanillaInput);
        userEvent.type(vanillaInput, "2");
        expect(grandTotal).toHaveTextContent("5.50");
    });

    test("grand total updates properly if an item is removed", async () => {
        render(<OrderEntry />);
        const grandTotal = screen.getByRole("heading", {
            name: /grand total: \$/i,
        });

        //add cherries, grand total should be 1.50
        const cherriesCheckbox = await screen.findByRole("checkbox", {
            name: "Cherries",
        });
        userEvent.click(cherriesCheckbox);

        // update scoops to 2, grand total should be $5.50
        const vanillaInput = await screen.findByRole("spinbutton", {
            name: "Vanilla",
        });
        userEvent.clear(vanillaInput);
        userEvent.type(vanillaInput, "2");

        //remove 1 scoop of vanilla
        userEvent.type(vanillaInput, "1");

        //check grand total
        expect(grandTotal).toHaveTextContent("3.50");

        //remove cherries and check grand total
        userEvent.click(cherriesCheckbox);
        expect(grandTotal).toHaveTextContent("2.00");
    });
});
