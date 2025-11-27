// services/api.js

const BASE_URL = "http://martha.jh.shawinigan.info/queries";

// Token pour team4:4Feab111753228450e4a1a5a!458
const MARTHA_AUTH = "dGVhbTQ6NEZlYWIxMTE3NTMyMjg0NTBlNGExYTVhITQ1OA=="; 

export const executeQuery = async (queryName, params = {}) => {
    try {
        const url = `${BASE_URL}/${queryName}/execute`;
        
        console.log(`[API Request] ${queryName}`, params);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth': MARTHA_AUTH
            },
            body: JSON.stringify(params)
        });

        const json = await response.json();
        
        // Log pour le débogage
        if(!json.success) console.error(`[API Error]`, json.error);
        
        return json;

    } catch (error) {
        console.error(`[Network Error]`, error);
        return { success: false, error: error.message };
    }
};