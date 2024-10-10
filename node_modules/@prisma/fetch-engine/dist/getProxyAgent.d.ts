import { HttpProxyAgentOptions } from 'http-proxy-agent';
import { HttpsProxyAgentOptions } from 'https-proxy-agent';
export declare function getProxyAgent(url: string): HttpProxyAgentOptions<string> | HttpsProxyAgentOptions<string> | undefined;
