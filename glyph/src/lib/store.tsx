import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_WIDGET,
  migrateKnowledgeFiles,
  PLANS,
  SEED_ACTIVITY,
  SEED_FILES,
  type ActivityItem,
  type KnowledgeFile,
  type OnboardingStep,
  type PlanId,
  type WidgetConfig,
} from '@/lib/data';
import {
  buildSeedConversations,
  conversationWorkspaceId,
  createEmptyConversation,
  generateConversationTitle,
  type Conversation,
  type ConversationMessage,
  type KnowledgeBaseId,
} from '@/lib/conversations';
import { DEFAULT_WORKSPACE_ID } from '@/lib/workspaces';

type User = {
  name: string;
  email: string;
};

type Workspace = {
  name: string;
  website: string;
  industry: string;
};

type Chatbot = {
  name: string;
  purpose: string;
  language: string;
  tone: string;
  published: boolean;
};

type AppState = {
  user: User | null;
  workspace: Workspace | null;
  chatbot: Chatbot | null;
  onboardingStep: OnboardingStep;
  onboardingComplete: boolean;
  files: KnowledgeFile[];
  plan: PlanId;
  widget: WidgetConfig;
  activity: ActivityItem[];
  trained: boolean;
  showPaywall: boolean;
  paywallReason: string;
  showSettings: boolean;
  conversations: Conversation[];
  activeConversationId: string | null;
  activeProjectId: string;
};

type AppActions = {
  signUp: (user: User) => void;
  signIn: (user: User) => void;
  signOut: () => void;
  setWorkspace: (workspace: Workspace) => void;
  setActiveProjectId: (id: string) => void;
  setChatbot: (chatbot: Omit<Chatbot, 'published'>) => void;
  setOnboardingStep: (step: OnboardingStep) => void;
  completeOnboarding: () => void;
  addFiles: (files: KnowledgeFile[]) => void;
  updateFile: (id: string, patch: Partial<KnowledgeFile>) => void;
  removeFile: (id: string) => void;
  setPlan: (plan: PlanId) => void;
  setWidget: (patch: Partial<WidgetConfig>) => void;
  setTrained: (trained: boolean) => void;
  publishWidget: () => void;
  openPaywall: (reason: string) => void;
  closePaywall: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  pushActivity: (item: Omit<ActivityItem, 'id'>) => void;
  canAddDocument: () => boolean;
  canCreateChatbot: () => boolean;
  createConversation: (
    knowledgeBase?: KnowledgeBaseId,
    workspaceId?: string,
  ) => string;
  setActiveConversation: (id: string | null) => void;
  updateConversation: (id: string, patch: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  duplicateConversation: (id: string) => string | null;
  appendMessage: (conversationId: string, message: ConversationMessage) => void;
  replaceMessages: (conversationId: string, messages: ConversationMessage[]) => void;
  patchMessage: (
    conversationId: string,
    messageId: string,
    patch: Partial<ConversationMessage>,
  ) => void;
};

const STORAGE_KEY = 'labagent-prototype-v1';

const defaultState: AppState = {
  user: null,
  workspace: null,
  chatbot: null,
  onboardingStep: 'welcome',
  onboardingComplete: false,
  files: [],
  plan: 'starter',
  widget: DEFAULT_WIDGET,
  activity: [],
  trained: false,
  showPaywall: false,
  paywallReason: '',
  showSettings: false,
  conversations: [],
  activeConversationId: null,
  activeProjectId: DEFAULT_WORKSPACE_ID,
};

/** Isolated in-memory workspace for the landing product recording */
function demoCaptureState(): AppState {
  const conversations = buildSeedConversations();
  return {
    ...defaultState,
    user: { name: 'Researcher', email: 'researcher@helixbio.lab' },
    workspace: {
      name: 'Helix Bio',
      website: 'helixbio.lab',
      industry: 'Biotechnology',
    },
    chatbot: {
      name: 'Lab Assistant',
      purpose: 'Protocol and SOP research',
      language: 'English',
      tone: 'Precise',
      published: true,
    },
    onboardingStep: 'done',
    onboardingComplete: true,
    files: migrateKnowledgeFiles(SEED_FILES),
    plan: 'research',
    widget: { ...DEFAULT_WIDGET },
    activity: SEED_ACTIVITY,
    trained: true,
    conversations,
    activeConversationId: conversations[0]?.id ?? null,
    activeProjectId: DEFAULT_WORKSPACE_ID,
  };
}

function migrateConversations(conversations: Conversation[]): Conversation[] {
  const mapped = conversations.map((c) => ({
    ...c,
    workspaceId: conversationWorkspaceId(c),
  }));
  const hasGeneticsSeed = mapped.some(
    (c) => c.id === 'seed-editing-log' || c.id === 'seed-gene-seq',
  );
  const hasLegacySeeds = mapped.some((c) => c.id.startsWith('seed-'));
  if (hasLegacySeeds && !hasGeneticsSeed) {
    return buildSeedConversations();
  }
  return mapped;
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = { ...defaultState, ...JSON.parse(raw) } as AppState;
    if (parsed.files?.length) {
      parsed.files = migrateKnowledgeFiles(parsed.files);
    }
    if (parsed.conversations?.length) {
      parsed.conversations = migrateConversations(parsed.conversations);
    }
    if (!parsed.activeProjectId) {
      parsed.activeProjectId = DEFAULT_WORKSPACE_ID;
    }
    return parsed;
  } catch {
    return defaultState;
  }
}

const AppContext = createContext<(AppState & AppActions) | null>(null);

export function AppProvider({
  children,
  mode = 'default',
}: {
  children: ReactNode;
  /** demo-capture = in-memory Research workspace for landing screen recording */
  mode?: 'default' | 'demo-capture';
}) {
  const persist = mode === 'default';
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === 'undefined') return defaultState;
    if (mode === 'demo-capture') return demoCaptureState();
    return loadState();
  });

  useEffect(() => {
    if (!persist) return;
    const {
      showPaywall: _,
      paywallReason: __,
      showSettings: ___,
      ...persistable
    } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  }, [state, persist]);

  const signUp = useCallback((user: User) => {
    setState((s) => ({
      ...s,
      user,
      onboardingStep: 'welcome',
      onboardingComplete: false,
      files: [],
      activity: [],
      trained: false,
      chatbot: null,
      workspace: null,
    }));
  }, []);

  const signIn = useCallback((user: User) => {
    setState((s) => {
      if (s.onboardingComplete && s.chatbot) {
        const conversations = s.conversations.length
          ? s.conversations
          : buildSeedConversations();
        return {
          ...s,
          user,
          conversations,
          activeConversationId:
            s.activeConversationId &&
            conversations.some((c) => c.id === s.activeConversationId)
              ? s.activeConversationId
              : conversations[0]?.id ?? null,
        };
      }
      const conversations = s.conversations.length
        ? s.conversations
        : buildSeedConversations();
      return {
        ...s,
        user,
        workspace: s.workspace ?? {
          name: 'Helix Bio',
          website: 'https://helixbio.lab',
          industry: 'Biotech',
        },
        chatbot: s.chatbot ?? {
          name: 'Lab Assistant',
          purpose: 'Answers from uploaded protocols, SOPs, and publications.',
          language: 'English',
          tone: 'Precise',
          published: true,
        },
        files:
          s.files.length && s.files.every((f) => 'project' in f && 'sizeBytes' in f)
            ? migrateKnowledgeFiles(s.files)
            : SEED_FILES,
        activity: s.activity.length ? s.activity : SEED_ACTIVITY,
        conversations,
        activeConversationId:
          s.activeConversationId &&
          conversations.some((c) => c.id === s.activeConversationId)
            ? s.activeConversationId
            : conversations[0]?.id ?? null,
        trained: true,
        onboardingComplete: true,
        onboardingStep: 'done',
        widget: {
          ...DEFAULT_WIDGET,
          ...s.widget,
          name: s.chatbot?.name ?? 'Lab Assistant',
        },
      };
    });
  }, []);

  const signOut = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const setWorkspace = useCallback((workspace: Workspace) => {
    setState((s) => ({
      ...s,
      workspace,
      onboardingStep: s.onboardingComplete ? s.onboardingStep : 'chatbot',
    }));
  }, []);

  const setActiveProjectId = useCallback((id: string) => {
    setState((s) => ({ ...s, activeProjectId: id }));
  }, []);

  const setChatbot = useCallback((chatbot: Omit<Chatbot, 'published'>) => {
    setState((s) => ({
      ...s,
      chatbot: { ...chatbot, published: s.chatbot?.published ?? false },
      widget: {
        ...s.widget,
        name: chatbot.name,
        ...(s.chatbot
          ? {}
          : {
              greeting: `Hello. Ask ${chatbot.name} about your protocols, SOPs, or laboratory documentation. Answers come only from documents your organization has uploaded.`,
            }),
      },
      onboardingStep: s.onboardingComplete ? s.onboardingStep : 'knowledge',
    }));
  }, []);

  const setOnboardingStep = useCallback((step: OnboardingStep) => {
    setState((s) => ({ ...s, onboardingStep: step }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setState((s) => {
      const conversations = s.conversations.length
        ? s.conversations
        : buildSeedConversations();
      return {
        ...s,
        onboardingComplete: true,
        onboardingStep: 'done',
        trained: true,
        activity: SEED_ACTIVITY,
        files:
          s.files.length && s.files.every((f) => 'project' in f && 'sizeBytes' in f)
            ? migrateKnowledgeFiles(s.files)
            : SEED_FILES,
        conversations,
        activeConversationId:
          s.activeConversationId ?? conversations[0]?.id ?? null,
      };
    });
  }, []);

  const addFiles = useCallback((incoming: KnowledgeFile[]) => {
    setState((s) => {
      const files = incoming.filter((f) => !s.files.some((x) => x.id === f.id));
      if (!files.length) return s;
      return {
        ...s,
        files: [...files, ...s.files],
        activity: [
          {
            id: `act-${Date.now()}`,
            text:
              files[0]?.source === 'chat'
                ? `Uploaded from chat: ${files[0]?.name ?? 'document'}`
                : `Indexed ${files[0]?.name ?? 'documents'}`,
            time: 'Just now',
            type: 'upload' as const,
          },
          ...s.activity,
        ],
      };
    });
  }, []);

  const updateFile = useCallback((id: string, patch: Partial<KnowledgeFile>) => {
    setState((s) => ({
      ...s,
      files: s.files.map((f) => (f.id === id ? { ...f, ...patch } : f)),
    }));
  }, []);

  const removeFile = useCallback((id: string) => {
    setState((s) => ({ ...s, files: s.files.filter((f) => f.id !== id) }));
  }, []);

  const setPlan = useCallback((plan: PlanId) => {
    setState((s) => ({
      ...s,
      plan,
      showPaywall: false,
      widget: {
        ...s.widget,
        showBranding: plan === 'starter',
      },
    }));
  }, []);

  const setWidget = useCallback((patch: Partial<WidgetConfig>) => {
    setState((s) => ({
      ...s,
      widget: { ...s.widget, ...patch },
      chatbot:
        patch.name !== undefined && s.chatbot
          ? { ...s.chatbot, name: patch.name }
          : s.chatbot,
    }));
  }, []);

  const setTrained = useCallback((trained: boolean) => {
    setState((s) => ({ ...s, trained }));
  }, []);

  const publishWidget = useCallback(() => {
    setState((s) => ({
      ...s,
      chatbot: s.chatbot ? { ...s.chatbot, published: true } : s.chatbot,
      activity: [
        {
          id: `act-${Date.now()}`,
          text: 'Assistant published to workspace',
          time: 'Just now',
          type: 'publish',
        },
        ...s.activity,
      ],
    }));
  }, []);

  const openPaywall = useCallback((reason: string) => {
    setState((s) => ({ ...s, showPaywall: true, paywallReason: reason }));
  }, []);

  const closePaywall = useCallback(() => {
    setState((s) => ({ ...s, showPaywall: false }));
  }, []);

  const openSettings = useCallback(() => {
    setState((s) => ({ ...s, showSettings: true }));
  }, []);

  const closeSettings = useCallback(() => {
    setState((s) => ({ ...s, showSettings: false }));
  }, []);

  const pushActivity = useCallback((item: Omit<ActivityItem, 'id'>) => {
    setState((s) => ({
      ...s,
      activity: [{ ...item, id: `act-${Date.now()}` }, ...s.activity],
    }));
  }, []);

  const canAddDocument = useCallback(() => {
    const limit = PLANS[state.plan].limits.documents;
    return state.files.length < limit;
  }, [state.files.length, state.plan]);

  const canCreateChatbot = useCallback(() => {
    return state.plan !== 'starter' || !state.chatbot;
  }, [state.chatbot, state.plan]);

  const createConversation = useCallback(
    (knowledgeBase?: KnowledgeBaseId, workspaceId?: string) => {
      let newId = '';
      setState((s) => {
        const conv = createEmptyConversation(
          knowledgeBase,
          workspaceId ?? (s.activeProjectId || DEFAULT_WORKSPACE_ID),
        );
        newId = conv.id;
        return {
          ...s,
          conversations: [conv, ...s.conversations],
          activeConversationId: conv.id,
        };
      });
      return newId;
    },
    [],
  );

  const setActiveConversation = useCallback((id: string | null) => {
    setState((s) => ({ ...s, activeConversationId: id }));
  }, []);

  const updateConversation = useCallback(
    (id: string, patch: Partial<Conversation>) => {
      setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id === id
            ? { ...c, ...patch, updatedAt: patch.updatedAt ?? new Date().toISOString() }
            : c,
        ),
      }));
    },
    [],
  );

  const deleteConversation = useCallback((id: string) => {
    setState((s) => {
      const conversations = s.conversations.filter((c) => c.id !== id);
      const activeConversationId =
        s.activeConversationId === id
          ? conversations[0]?.id ?? null
          : s.activeConversationId;
      return { ...s, conversations, activeConversationId };
    });
  }, []);

  const duplicateConversation = useCallback((id: string) => {
    let newId: string | null = null;
    setState((s) => {
      const src = s.conversations.find((c) => c.id === id);
      if (!src) return s;
      const now = new Date().toISOString();
      const copy: Conversation = {
        ...src,
        id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        title: `${src.title} (copy)`,
        pinned: false,
        createdAt: now,
        updatedAt: now,
        messages: src.messages.map((m) => ({
          ...m,
          id: `${m.id}-copy-${Math.random().toString(36).slice(2, 6)}`,
        })),
      };
      newId = copy.id;
      return {
        ...s,
        conversations: [copy, ...s.conversations],
        activeConversationId: copy.id,
      };
    });
    return newId;
  }, []);

  const appendMessage = useCallback(
    (conversationId: string, message: ConversationMessage) => {
      setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) => {
          if (c.id !== conversationId) return c;
          const messages = [...c.messages, message];
          const firstUser = messages.find((m) => m.role === 'user');
          const shouldTitle =
            c.title === 'New conversation' &&
            message.role === 'user' &&
            !!firstUser;
          return {
            ...c,
            messages,
            title: shouldTitle
              ? generateConversationTitle(message.content)
              : c.title,
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    [],
  );

  const replaceMessages = useCallback(
    (conversationId: string, messages: ConversationMessage[]) => {
      setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id === conversationId
            ? { ...c, messages, updatedAt: new Date().toISOString() }
            : c,
        ),
      }));
    },
    [],
  );

  const patchMessage = useCallback(
    (
      conversationId: string,
      messageId: string,
      patch: Partial<ConversationMessage>,
    ) => {
      setState((s) => ({
        ...s,
        conversations: s.conversations.map((c) =>
          c.id !== conversationId
            ? c
            : {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId ? { ...m, ...patch } : m,
                ),
                updatedAt: new Date().toISOString(),
              },
        ),
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      signUp,
      signIn,
      signOut,
      setWorkspace,
      setActiveProjectId,
      setChatbot,
      setOnboardingStep,
      completeOnboarding,
      addFiles,
      updateFile,
      removeFile,
      setPlan,
      setWidget,
      setTrained,
      publishWidget,
      openPaywall,
      closePaywall,
      openSettings,
      closeSettings,
      pushActivity,
      canAddDocument,
      canCreateChatbot,
      createConversation,
      setActiveConversation,
      updateConversation,
      deleteConversation,
      duplicateConversation,
      appendMessage,
      replaceMessages,
      patchMessage,
    }),
    [
      state,
      signUp,
      signIn,
      signOut,
      setWorkspace,
      setActiveProjectId,
      setChatbot,
      setOnboardingStep,
      completeOnboarding,
      addFiles,
      updateFile,
      removeFile,
      setPlan,
      setWidget,
      setTrained,
      publishWidget,
      openPaywall,
      closePaywall,
      openSettings,
      closeSettings,
      pushActivity,
      canAddDocument,
      canCreateChatbot,
      createConversation,
      setActiveConversation,
      updateConversation,
      deleteConversation,
      duplicateConversation,
      appendMessage,
      replaceMessages,
      patchMessage,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
