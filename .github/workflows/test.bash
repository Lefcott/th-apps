PACKAGES=(teamhub-dining)
files=("packages/app-content/src/test.css", "packages/app-content/src/index.html")
for file in $files; do
  if [[ $file =~ .*packages/.* ]]; then
    PACKAGE_NAME=`echo $file | sed 's|^packages/\([^/]*\).*$|\1|'`

    if ! [[ $PACKAGES[*] =~ $PACKAGE_NAME ]]; then
      PACKAGES+=("$PACKAGE_NAME")
    fi
  fi
done

MATRIX=()
for package in ${PACKAGES[@]}; do
  echo $package
  MATRIX+=("{\"name\":\"$package\"}")
done

SERIALIZED_MATRIX="$(IFS=,; echo "${MATRIX[*]}")"

echo "::set-output name=packages::{\"include\":[$SERIALIZED_MATRIX]}"