#!/bin/bash

git clone https://github.com/YL2209/luci-app-alpha-config.git package/luci-app-alpha-config
./scripts/feeds install luci-app-alpha-config
echo "CONFIG_ALL_NONSHARED=n" > .config
echo "CONFIG_ALL_KMODS=n" >> .config
echo "CONFIG_ALL=n" >> .config
echo "CONFIG_AUTOREMOVE=n" >> .config
echo "CONFIG_LUCI_LANG_zh_Hans=y" >> .config
echo "CONFIG_PACKAGE_luci-app-alpha-config=m" >> .config