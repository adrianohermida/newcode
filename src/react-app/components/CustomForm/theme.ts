



import { defaultFormTheme, IFormTheme } from "./defaultTheme";

/**
 * @description Tema personalizado para os formulários do site Hermida Maia Advocacia.
 *             Utiliza as cores da marca (brand-dark, brand-primary) e tipografia Inter.
 */
export const contactFormTheme: Partial<IFormTheme> = {
  form: {
    container: "space-y-6",
    fieldsContainer: "grid grid-cols-1 gap-y-6",
    buttonSection: "pt-6",
  },
  field: {
    label: "block text-sm font-semibold text-white/70 mb-2 ml-1",
    requiredIndicator: "text-brand-primary ml-1",
    errorMessage: "mt-2 text-xs text-red-400 font-medium",
  },
  input: {
    base: "w-full bg-brand-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-white/20",
    normal: "border-white/10",
    error: "border-red-500/50",
  },
  textarea: {
    base: "w-full bg-brand-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all placeholder:text-white/20 min-h-[150px]",
    normal: "border-white/10",
    error: "border-red-500/50",
  },
  select: {
    base: "w-full bg-brand-dark border border-white/10 rounded-xl px-5 py-4 text-white focus:border-brand-primary outline-none transition-all appearance-none",
    normal: "border-white/10",
    error: "border-red-500/50",
  },
  buttons: {
    submit: {
      base: "w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-5 rounded-2xl font-extrabold text-xl shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-95",
    },
    reset: {
      base: "hidden",
    }
  }
};



export const financeConfigTheme: Partial<IFormTheme> = {
  form: {
    container: "space-y-8",
    fieldsContainer: "grid grid-cols-1 sm:grid-cols-2 gap-6",
    buttonSection: "pt-8 flex gap-3 justify-end",
  },
  field: {
    label: "block text-sm font-semibold text-white/70 mb-3",
    requiredIndicator: "text-red-400 ml-1",
    errorMessage: "mt-2 text-xs text-red-400 font-medium",
  },
  input: {
    base: "w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-primary outline-none transition-all placeholder:text-white/20",
    normal: "border-white/10",
    error: "border-red-500/50",
  },
  buttons: {
    submit: {
      base: "bg-brand-primary hover:bg-brand-primary/90 text-white px-8 py-3 rounded-lg text-sm font-bold transition-all shadow-lg shadow-brand-primary/20",
    },
    reset: {
      base: "bg-white/5 hover:bg-white/10 text-white px-8 py-3 rounded-lg text-sm font-bold transition-all border border-white/10",
    }
  }
};

export const newsletterTheme: Partial<IFormTheme> = {
  form: {
    container: "space-y-4",
    fieldsContainer: "space-y-3",
    buttonSection: "pt-1",
  },
  field: {
    label: "hidden",
    errorMessage: "text-[10px] text-red-400 mt-1 ml-1",
  },
  input: {
    base: "w-full bg-brand-elevated border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-primary transition-all placeholder:text-white/30",
    normal: "border-white/10",
    error: "border-red-500/50",
  },
  booleanCheckbox: {
    container: "flex items-start gap-2 cursor-pointer group",
    label: "text-[11px] text-white/40 leading-tight group-hover:text-white/60 transition-colors",
    input: "mt-0.5 h-3.5 w-3.5 rounded border-white/10 bg-brand-dark text-brand-primary focus:ring-brand-primary focus:ring-offset-0",
  },
  buttons: {
    submit: {
      base: "w-full bg-brand-primary hover:bg-brand-primary/90 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/10",
    },
    reset: {
      base: "hidden",
    }
  }
};

export const faturaFormTheme: Partial<IFormTheme> = {
  form: {
    container: "space-y-6",
    fieldsContainer: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
    buttonSection: "pt-6 flex gap-3 justify-end border-t border-white/5",
  },
  field: {
    label: "block text-xs font-bold uppercase tracking-widest text-white/60 mb-2",
    requiredIndicator: "text-red-400 ml-1",
    errorMessage: "mt-1 text-xs text-red-400 font-medium",
  },
  input: {
    base: "w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-primary outline-none transition-all placeholder:text-white/20",
    normal: "border-white/10",
    error: "border-red-500/50",
  },
  select: {
    base: "w-full bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-primary outline-none transition-all appearance-none",
    normal: "border-white/10",
    error: "border-red-500/50",
  },
  buttons: {
    submit: {
      base: "bg-brand-primary hover:bg-brand-primary/90 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all",
    },
    reset: {
      base: "bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all border border-white/10",
    }
  }
};
  


