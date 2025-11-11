/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';

describe('Button', () => {
  describe('Rendering', () => {
    it('renders a button with text', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('renders without children', () => {
      render(<Button ariaLabel="Empty button" />);
      const button = screen.getByRole('button', { name: /empty button/i });
      expect(button).toBeInTheDocument();
    });

    it('applies default props correctly', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'md');
      expect(button).toHaveAttribute('data-tone', 'grey');
      expect(button).toHaveAttribute('data-hierarchy', 'secondary');
    });

    it('applies custom className', () => {
      render(<Button className="custom-class">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('arkem-btn');
    });
  });

  describe('Props', () => {
    it('applies size prop', () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-size', 'lg');
    });

    it('applies hierarchy prop', () => {
      render(<Button hierarchy="primary">Primary Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-hierarchy', 'primary');
    });

    it('applies tone prop', () => {
      render(<Button tone="color">Color Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-tone', 'color');
    });

    it('enforces black tone when hierarchy is mode', () => {
      render(<Button hierarchy="mode" tone="grey">Mode Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-tone', 'black');
    });

    it('applies fullWidth prop', () => {
      render(<Button fullWidth>Full Width Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('is-fullwidth');
    });

    it('applies disabled prop', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-disabled', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('applies state prop', () => {
      render(<Button state="hover">Hover Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-forced-state', 'hover');
    });

    it('applies function prop', () => {
      render(<Button function="close">Close Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-function', 'close');
    });
  });

  describe('Icons', () => {
    it('renders with leading icon', () => {
      render(<Button leadingIconName="Plus">Add</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-has-leading', 'true');
      // Icon should be present
      const icon = button.querySelector('.arkem-btn__icon--lead');
      expect(icon).toBeInTheDocument();
    });

    it('renders with trailing icon', () => {
      render(<Button trailingIconName="ArrowRight" iconTrailing={true}>Next</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-has-trailing', 'true');
      const icon = button.querySelector('.arkem-btn__icon--trail');
      expect(icon).toBeInTheDocument();
    });

    it('renders icon-only button when showText is false', () => {
      render(
        <Button leadingIconName="Plus" showText={false} ariaLabel="Add">
          Add
        </Button>
      );
      const button = screen.getByRole('button', { name: /add/i });
      expect(button).toHaveAttribute('data-icon-only', 'true');
      expect(button).toHaveAttribute('aria-label', 'Add');
    });

    it('hides leading icon when iconLeading is false', () => {
      render(
        <Button leadingIconName="Plus" iconLeading={false}>
          Button
        </Button>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-has-leading', 'false');
    });
  });

  describe('User Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(
        <Button onClick={handleClick} disabled>
          Disabled Button
        </Button>
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('handles keyboard interactions', async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();
      render(<Button onClick={handleClick}>Button</Button>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for icon-only buttons', () => {
      render(
        <Button leadingIconName="Plus" showText={false} ariaLabel="Add item">
          Add
        </Button>
      );
      const button = screen.getByRole('button', { name: /add item/i });
      expect(button).toHaveAttribute('aria-label', 'Add item');
    });

    it('uses children as aria-label fallback for icon-only buttons', () => {
      render(
        <Button leadingIconName="Plus" showText={false}>
          Add Item
        </Button>
      );
      const button = screen.getByRole('button', { name: /add item/i });
      expect(button).toHaveAttribute('aria-label', 'Add Item');
    });

    it('marks icons as aria-hidden', () => {
      render(<Button leadingIconName="Plus">Add</Button>);
      const icon = screen.getByRole('button').querySelector('.arkem-btn__icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('has proper disabled state attributes', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('Hierarchy Derivation', () => {
    it('derives secondary hierarchy for sm size', () => {
      render(<Button size="sm">Small Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-hierarchy', 'secondary');
    });

    it('derives secondary hierarchy for md size', () => {
      render(<Button size="md">Medium Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-hierarchy', 'secondary');
    });

    it('derives primary hierarchy for lg size', () => {
      render(<Button size="lg">Large Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-hierarchy', 'primary');
    });

    it('uses explicit hierarchy over derived', () => {
      render(<Button size="sm" hierarchy="primary">Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-hierarchy', 'primary');
    });
  });

  describe('Snapshots', () => {
    it('matches snapshot for default button', () => {
      const { container } = render(<Button>Default Button</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for primary button', () => {
      const { container } = render(
        <Button hierarchy="primary" size="lg">
          Primary Button
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for disabled button', () => {
      const { container } = render(<Button disabled>Disabled Button</Button>);
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for button with icons', () => {
      const { container } = render(
        <Button leadingIconName="Plus" trailingIconName="ArrowRight">
          Button with Icons
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    it('matches snapshot for icon-only button', () => {
      const { container } = render(
        <Button leadingIconName="Plus" showText={false} ariaLabel="Add">
          Add
        </Button>
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });
});

