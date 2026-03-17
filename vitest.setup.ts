import '@testing-library/jest-dom';

// mock window.matchMedia for Antd components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});

// Mock window.getComputedStyle，避免伪元素报错
Object.defineProperty(window, 'getComputedStyle', {
  value: (elt: Element, pseudo?: string) => {
    return {
      getPropertyValue: (prop: string) => {
        // 如果你想针对某些属性返回特定值，可以在这里处理
        return '';
      },
      // 可以添加常用的 CSSStyleDeclaration 属性，防止报 undefined
      display: '',
      visibility: '',
      content: '',
      getPropertyPriority: () => '',
      item: () => '',
      length: 0,
    } as unknown as CSSStyleDeclaration;
  },
  writable: true,
});

// Mock ResizeObserver，避免测试报错
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', {
  value: ResizeObserver,
});