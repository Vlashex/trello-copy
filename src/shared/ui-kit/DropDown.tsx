import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

// Интерфейс для состояния DropDown
export interface DropDownState {
  isOpen: boolean;
  isSticky: boolean;
}

// Интерфейс для методов DropDown
export interface DropDownActions {
  toggleDropdown: () => void;
  openDropdown: () => void;
  closeDropdown: () => void;
  setSticky: (sticky: boolean) => void;
}

// Полный интерфейс контекста
export interface DropDownContextInterface {
  state: DropDownState;
  actions: DropDownActions;
}

// Создаем контекст с значением по умолчанию
export const DropDownContext = createContext<DropDownContextInterface | null>(
  null
);

// Хук для использования контекста
export const useDropDownContext = (): DropDownContextInterface => {
  const context = useContext(DropDownContext);
  if (!context) {
    throw new Error(
      "useDropDownContext must be used within a DropDown provider"
    );
  }
  return context;
};

// Пропсы для DropDown компонента
export interface DropDownProps {
  children: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
  onStateChange?: (state: DropDownState) => void;
  initialOpen?: boolean;
  closeOnOutsideClick?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Пропсы для DropDownButton
export interface DropDownButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  asChild?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

// Пропсы для DropDownContent
export interface DropDownContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  position?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  width?: "auto" | "fit" | "full";
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

// Пропсы для DropDownItem
export interface DropDownItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  onSelect?: (event: React.MouseEvent) => void;
}

// Интерфейс для рефа DropDown
export interface DropDownRef {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

// Вспомогательные типы
export type DropDownPosition = "top" | "bottom" | "left" | "right";
export type DropDownAlign = "start" | "center" | "end";
export type DropDownWidth = "auto" | "fit" | "full";

// Типы событий
export interface DropDownEvent {
  type: "open" | "close" | "toggle";
  timestamp: number;
  state: DropDownState;
}

// Реализация DropDown компонента с использованием интерфейса
export const DropDown: React.FC<DropDownProps> = ({
  children,
  onToggle,
  onStateChange,
  initialOpen = false,
  closeOnOutsideClick = true,
  className = "",
  style,
  ...props
}) => {
  const [state, setState] = useState<DropDownState>({
    isOpen: initialOpen,
    isSticky: false,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  const updateState = useCallback(
    (newState: Partial<DropDownState>) => {
      setState((prev) => {
        const updatedState = { ...prev, ...newState };
        onStateChange?.(updatedState);
        return updatedState;
      });
    },
    [onStateChange]
  );

  const toggleDropdown = useCallback(() => {
    updateState({
      isOpen: !state.isOpen,
      isSticky: !state.isOpen, // Становится sticky при открытии через клик
    });
    onToggle?.(!state.isOpen);
  }, [state.isOpen, updateState, onToggle]);

  const openDropdown = useCallback(() => {
    if (!state.isSticky) {
      updateState({ isOpen: true });
      onToggle?.(true);
    }
  }, [state.isSticky, updateState, onToggle]);

  const closeDropdown = useCallback(() => {
    if (!state.isSticky) {
      updateState({ isOpen: false });
      onToggle?.(false);
    }
  }, [state.isSticky, updateState, onToggle]);

  const setSticky = useCallback(
    (sticky: boolean) => {
      updateState({ isSticky: sticky });
    },
    [updateState]
  );

  // Обработчик клика вне компонента
  useEffect(() => {
    if (!closeOnOutsideClick) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
        setSticky(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeOnOutsideClick, closeDropdown, setSticky]);

  const contextValue: DropDownContextInterface = {
    state,
    actions: {
      toggleDropdown,
      openDropdown,
      closeDropdown,
      setSticky,
    },
  };

  return (
    <DropDownContext.Provider value={contextValue}>
      <div
        ref={dropdownRef}
        className={`dropdown-container ${className}`}
        style={style}
        {...props}
      >
        {children}
      </div>
    </DropDownContext.Provider>
  );
};

// DropDownButton с типизацией
export const DropDownButton: React.FC<DropDownButtonProps> = ({
  children,
  className = "",
  style,
  disabled = false,
  asChild = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const { state, actions } = useDropDownContext();

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return;
    actions.toggleDropdown();
    onClick?.(event);
  };

  const handleMouseEnter = (event: React.MouseEvent) => {
    actions.openDropdown();
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    actions.closeDropdown();
    onMouseLeave?.(event);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      disabled,
      ...props,
    } as Partial<unknown>);
  }

  return (
    <button
      className={`dropdown-button ${className} ${state.isOpen ? "active" : ""}`}
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// DropDownContent с типизацией
export const DropDownContent: React.FC<DropDownContentProps> = ({
  children,
  className = "",
  style,
  position = "bottom",
  align = "start",
  width = "auto",
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const { state, actions } = useDropDownContext();

  if (!state.isOpen) return null;

  const handleMouseEnter = (event: React.MouseEvent) => {
    actions.openDropdown();
    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    actions.closeDropdown();
    onMouseLeave?.(event);
  };

  const positionClass = `dropdown-content-${position}`;
  const alignClass = `dropdown-content-align-${align}`;
  const widthClass = `dropdown-content-width-${width}`;

  return (
    <div
      className={`dropdown-content ${positionClass} ${alignClass} ${widthClass} ${className}`}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  );
};

// DropDownItem с типизацией
export const DropDownItem: React.FC<DropDownItemProps> = ({
  children,
  className = "",
  style,
  disabled = false,
  onClick,
  onSelect,
  ...props
}) => {
  const { actions } = useDropDownContext();

  const handleClick = (event: React.MouseEvent) => {
    if (disabled) return;

    if (!event.defaultPrevented) {
      actions.closeDropdown();
      actions.setSticky(false);
    }

    onClick?.(event);
    onSelect?.(event);
  };

  return (
    <div
      className={`dropdown-item ${disabled ? "disabled" : ""} ${className}`}
      style={style}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};
