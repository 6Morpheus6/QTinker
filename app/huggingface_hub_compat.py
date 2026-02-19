"""
Compatibility patch for huggingface_hub HfFolder import issue.
This provides HfFolder for older versions of huggingface_hub that don't have it.
"""
try:
    from huggingface_hub import HfFolder
except ImportError:
    # Fallback for older versions of huggingface_hub
    class HfFolder:
        @staticmethod
        def get_token():
            from huggingface_hub import whoami
            return whoami.get_token()
    
    # Export the patched HfFolder
    import sys
    sys.modules['huggingface_hub'] = type('MockModule', (), {
        'HfFolder': HfFolder
    })
    sys.modules['huggingface_hub.HfFolder'] = HfFolder
