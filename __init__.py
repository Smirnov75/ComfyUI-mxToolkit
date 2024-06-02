import os
import shutil

cPath = os.path.dirname(os.path.abspath(__file__))
sPath = os.path.abspath(f'{cPath}/js')
tPath = os.path.abspath(f'{cPath}/../../web/extensions/mxToolkit')

if os.path.exists(tPath): shutil.rmtree(tPath)
os.makedirs(tPath)
shutil.copytree(sPath, tPath, dirs_exist_ok=True)

from .mxtoolkit import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS
__all__ = ['NODE_CLASS_MAPPINGS', 'NODE_DISPLAY_NAME_MAPPINGS']
