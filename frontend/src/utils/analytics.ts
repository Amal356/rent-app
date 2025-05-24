
export interface VisitData {
  page: string;
  referrer: string;
  timestamp: string;
  userAgent: string;
  screenSize: string;
}

export interface EventData {
  event: string;
  data: Record<string, any>;
  timestamp: string;
  page: string;
}

/**
 * Track a page visit
 */
export const trackPageVisit = () => {
  const visitData: VisitData = {
    page: window.location.pathname,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
  };
  
  // Log the visit data to console
  console.log("Page visit tracked:", visitData);
  
  // Save visit to localStorage
  const visits = getStoredVisits();
  visits.push(visitData);
  localStorage.setItem("site_visits", JSON.stringify(visits));
  
  return visitData;
};

/**
 * Track an event
 */
export const trackEvent = (eventName: string, eventData: Record<string, any> = {}) => {
  const eventInfo: EventData = {
    event: eventName,
    data: eventData,
    timestamp: new Date().toISOString(),
    page: window.location.pathname,
  };
  
  // Log the event data to console
  console.log("Event tracked:", eventInfo);
  
  // Save event to localStorage
  const events = getStoredEvents();
  events.push(eventInfo);
  localStorage.setItem("site_events", JSON.stringify(events));
  
  return eventInfo;
};

/**
 * Get stored visits from localStorage
 */
export const getStoredVisits = (): VisitData[] => {
  return JSON.parse(localStorage.getItem("site_visits") || "[]");
};

/**
 * Get stored events from localStorage
 */
export const getStoredEvents = (): EventData[] => {
  return JSON.parse(localStorage.getItem("site_events") || "[]");
};

/**
 * Get analytics summary
 */
export const getAnalyticsSummary = () => {
  const visits = getStoredVisits();
  const events = getStoredEvents();
  
  const totalVisits = visits.length;
  const uniquePages = [...new Set(visits.map(v => v.page))].length;
  const eventCounts: Record<string, number> = {};
  
  events.forEach(event => {
    eventCounts[event.event] = (eventCounts[event.event] || 0) + 1;
  });
  
  return {
    totalVisits,
    uniquePages,
    eventCounts,
    recentVisits: visits.slice(-5),
    recentEvents: events.slice(-10),
  };
};

/**
 * Reset analytics data
 */
export const resetAnalytics = () => {
  localStorage.removeItem("site_visits");
  localStorage.removeItem("site_events");
};

/**
 * Get page view count by path
 */
export const getPageViewsByPath = () => {
  const visits = getStoredVisits();
  const pathCounts: Record<string, number> = {};
  
  visits.forEach(visit => {
    pathCounts[visit.page] = (pathCounts[visit.page] || 0) + 1;
  });
  
  return pathCounts;
};

// Add tracking to the ThemeToggle component
export const attachThemeToggleTracking = (setTheme: (theme: string) => void, trackEventFn?: (eventName: string, eventData?: Record<string, any>) => void) => {
  return (theme: string) => {
    // Use the provided trackEvent function or the imported one
    const trackFn = trackEventFn || trackEvent;
    trackFn("theme_change", { from: document.documentElement.classList.contains("dark") ? "dark" : "light", to: theme });
    setTheme(theme);
  };
};
