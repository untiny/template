export interface PluginMethodHeader {
  name: string,
  rtype?: "promise" | "callback" | "none"
}

export interface PluginHeader {
  name: string;
  methods: PluginMethodHeader[]
}